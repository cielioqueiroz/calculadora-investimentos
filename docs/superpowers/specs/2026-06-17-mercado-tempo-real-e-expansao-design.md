# Mercado em tempo real + expansão do simulador — Design

Data: 2026-06-17
Status: Aprovado (design), pendente plano de implementação

## Contexto

A `calculadora-investimentos` é um app estático (React 19 + Vite + TypeScript +
Tailwind + shadcn/ui) focado em renda fixa brasileira, hospedado no GitHub Pages,
com i18n (pt/en/es/zh/ru), tema "cofre" dourado dark/light, gráficos Recharts,
stores Zustand e persistência em localStorage. O cálculo central (`simulate`) é
genérico: recebe uma taxa anual e projeta juros compostos com aportes mensais.

## Objetivo

Evoluir o produto em duas frentes:

1. **Dados de mercado em tempo real**: ticker da B3 no header, página `/mercado`
   com criptomoedas, economias mundiais e ações B3.
2. **Expansão do simulador**: novos ativos (ações/FIIs/ETF/dólar/cripto), retorno
   real (desconto de IPCA), planejador de meta e detalhamento de IR/IOF.

E, transversalmente, polir UI/UX, acessibilidade, code review e testes.

## Restrições e princípios

- **Hospedagem estática** (GitHub Pages): sem backend, sem segredos no bundle.
- **Tempo real via APIs públicas com CORS** + **fallback para snapshot** quando a
  API falhar/estourar limite. A UI nunca quebra: degrada para o último dado bom
  ou para um snapshot embutido, sempre rotulando a defasagem.
- **Honestidade de dados**: cotações B3 em planos gratuitos têm atraso (~15min).
  A UI exibe o estado de frescor (atualizado há Xs / atrasado / demonstração) em
  vez de fingir tick-by-tick.
- **Convenções**: código/identificadores em inglês; comentários mínimos; tema
  cofre preservado (CSS vars HSL); rotas em português; sem dependências
  desnecessárias (camada de dados custom, sem react-query).

## Decisões de arquitetura

### Camada de dados (`src/lib/market/`)

Abstração com providers pequenos e normalizados + um hook genérico de polling.

```
src/lib/market/
  types.ts              # MarketQuote, CryptoQuote, ForexQuote, B3Quote, MarketStatus
  format.ts             # helpers de moeda/percentual reutilizáveis
  snapshots.ts          # fallback embutido + persistência do último dado bom
  providers/
    crypto.ts           # CoinGecko: simple/price + coins/markets (sparkline 7d)
    forex.ts            # AwesomeAPI: USD-BRL, EUR-BRL, GBP-BRL, JPY-BRL, CNY-BRL
    b3.ts               # brapi.dev: ^BVSP + tickers; token opcional VITE_BRAPI_TOKEN
  useMarketData.ts      # hook: polling, AbortController, estados data/stale/error
```

- **Validação**: respostas das APIs tipadas e validadas com **Zod** (já é
  dependência). Resposta inválida → trata como erro → fallback.
- **Polling**: cripto/câmbio ~30s, B3 ~60s. `AbortController` cancela requisições
  pendentes ao desmontar/refazer. Pausa quando a aba está em background
  (`document.visibilityState`).
- **Fallback em camadas**: (1) último dado bom em memória → (2) último dado bom
  em localStorage → (3) snapshot embutido em `snapshots.ts`. Cada nível marca
  `status` para a UI rotular (`live` | `stale` | `snapshot`).
- **Fontes**:
  - CoinGecko: `api.coingecko.com/api/v3/...` (CORS público, sem chave; rate
    limit ~10–30/min — daí o polling espaçado e o cache).
  - AwesomeAPI: `economia.awesomeapi.com.br/json/last/...` (CORS, sem chave).
  - brapi.dev: token opcional lido de `import.meta.env.VITE_BRAPI_TOKEN`. Sem
    token, usa snapshot rotulado "demonstração". Documentado no README.

### Ticker tape da B3 (header)

- Componente `MarketTicker` renderizado no topo do `Header` (faixa acima da linha
  de navegação), marquee auto-rolante com símbolo + preço + variação % colorida
  (verde/vermelho via tokens `success`/`destructive`).
- Acessibilidade: `aria-live="off"` (decorativo, atualização frequente),
  `prefers-reduced-motion` desativa a animação e vira lista estática rolável.
  Pausa o scroll no hover/focus.
- Usa `useMarketData` (b3 + um par de câmbio + BTC para dar contexto global).

### Página `/mercado`

Rota nova em `App.tsx`, item "Mercado" em `Sidebar` e `MobileNav` (ícone
`LineChart`). Três blocos no tema cofre, cada um com skeleton de loading e badge
de frescor:

1. **Economias mundiais**: cards bandeira + moeda vs BRL + variação +
   mini-sparkline (USD, EUR, GBP, JPY, CNY) e indicadores Brasil (Selic, CDI,
   IPCA, Ibovespa).
2. **Criptomoedas**: cards com logo, preço (BRL/USD), variação 24h, sparkline 7d,
   market cap. Botão "Simular este ativo" → leva ao simulador pré-preenchido.
3. **Ações B3**: grid/tabela de tickers (PETR4, VALE3, ITUB4, BBDC4, ABEV3, …)
   com preço e variação.

Na **Home**: card "Mercado agora" (Ibovespa, USD/BRL, BTC) linkando para
`/mercado`.

### Simulador & cálculos (`src/lib/calculations.ts`)

Reaproveita `simulate` (genérica). Adições:

- **Novos ativos** em `INVESTMENT_TYPES` (`src/constants/investments.ts`):
  - `acoes` (Ações B3), `fii` (FIIs), `etf` (ETF), `dolar` (Dólar), `cripto`
    (Cripto). `rateBasis: 'custom'` (retorno anual esperado **editável** pelo
    usuário), `risk: 'high'`, `fgcProtected: false`, aviso de volatilidade.
  - Tipo `RateBasis` ganha `'custom'`; `InvestmentCategory` ganha
    `'variable-income'` e `'crypto'`. `resolveAnnualRate` retorna a taxa custom
    informada para `'custom'`.
  - Regras tributárias: ações/ETF/cripto 15% sobre ganho; FII isento sobre
    dividendos (simplificação documentada na UI); dólar tratado como ganho de
    capital 15%. Modeladas como flag/percentual no tipo, sem reescrever a tabela
    regressiva da renda fixa.
- **Retorno real**: `SimulationResult` ganha `inflationRate` e `realNetBalance`
  (desconta IPCA acumulado no período). Função pura `applyInflation`. Exibido ao
  lado do valor nominal no `ResultSummary`.
- **Planejador de meta**: função pura `solveMonthlyContribution(target, initial,
  months, annualRate)` (resolve o aporte por fórmula de anuidade). Novo modo/seção
  no simulador (toggle "Projetar valor" ↔ "Planejar meta").
- **IR/IOF**: adicionar `iofRate(days)` (tabela regressiva de IOF para resgates
  < 30 dias) e breakdown bruto → IR → IOF → líquido no `ResultSummary`.
- **Testes Vitest** para cada função pura nova (`applyInflation`,
  `solveMonthlyContribution`, `iofRate`, taxação de renda variável).

### UI/UX, acessibilidade e code review

- Tema cofre preservado e estendido: sparklines com gradiente dourado, skeletons
  de loading, transições suaves, micro-animações `fade-in` já existentes.
- Acessibilidade: `aria-live` adequado, respeito a `prefers-reduced-motion`,
  contraste verificado nos novos elementos verde/vermelho.
- Code review: extrair formatação de moeda/percentual para `format.ts`
  reutilizável (hoje há formatação espalhada), tratamento gracioso de erros de
  rede, tipos estritos nas respostas de API.

### i18n, testes e deploy

- Novas chaves de tradução nos **5 idiomas** (rótulos de mercado e do simulador
  novo). Números/símbolos são neutros; apenas rótulos traduzem.
- Sem mudança de hospedagem. `VITE_BRAPI_TOKEN` documentado como opcional no
  README; ausência → snapshot rotulado.

## Fluxo de dados (resumo)

```
useMarketData(source)
  → provider.fetch() (CoinGecko | AwesomeAPI | brapi)
      → Zod parse
          ok    → cache memória + localStorage, status=live
          falha → fallback (memória → localStorage → snapshot), status=stale|snapshot
  → componente renderiza dados + badge de frescor + skeleton enquanto carrega
```

## Tratamento de erros

- Erro de rede/CORS/limite/timeout: cai para o fallback em camadas, nunca quebra.
- Resposta malformada: Zod rejeita → tratado como erro.
- Token brapi ausente: B3 entra em modo snapshot rotulado.
- Aba em background: pausa polling para poupar limite de API.

## Escopo / faseamento

Entrega em sequência (todas as fases nesta rodada):

1. Camada de dados (`src/lib/market/`) + `MarketTicker` no header.
2. Página `/mercado` (cripto + economias mundiais + ações B3) + card na Home.
3. Expansão do simulador (novos ativos, retorno real, meta, IR/IOF) + testes.
4. Polish de UI/UX, acessibilidade, code review, i18n (5 idiomas) e README.

## Fora de escopo (YAGNI)

- Backend/proxy serverless (decidido: APIs públicas + fallback).
- react-query ou outra lib de data-fetching (camada custom é suficiente).
- Contas de usuário, alertas de preço, carteira real, ordens de compra.
- Cotações tick-by-tick em tempo real de verdade na B3 (inviável no grátis).

## Critérios de sucesso

- Ticker da B3 visível no header em todas as páginas, com variação colorida e
  fallback rotulado quando sem dados ao vivo.
- `/mercado` exibe cripto, economias mundiais e ações B3 com atualização
  periódica, sparklines e badge de frescor; degrada graciosamente offline.
- Simulador suporta novos ativos com retorno esperado editável, retorno real,
  planejador de meta e breakdown IR/IOF, tudo com testes verdes (`npm test`).
- `npm run build` e `npm run lint` passam; tema cofre íntegro em dark/light;
  5 idiomas cobrindo as novas strings.
- Nenhum segredo no bundle; deploy segue no GitHub Pages.

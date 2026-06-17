# InvestCalc

Calculadora de investimentos de renda fixa. Simule o crescimento de uma aplicação com aportes mensais, compare diferentes investimentos no mesmo cenário e salve suas simulações — tudo no navegador, sem backend.

## Funcionalidades

- **Simulador** — projeção de juros compostos com aporte inicial, aportes mensais e prazo, já com o desconto do imposto de renda regressivo. Inclui **retorno real** (descontando a inflação estimada) e **planejador de meta** (calcula o aporte mensal necessário para um valor-alvo).
- **Mercado em tempo real** — ticker da B3 no topo, página `/mercado` com as principais economias do mundo (câmbio), criptomoedas e ações da B3, com mini-gráficos e indicador de atualização.
- **Comparação** — aplica o mesmo cenário a vários investimentos e destaca o melhor retorno líquido em gráfico e tabela.
- **Histórico** — salva, reabre e remove simulações, persistidas em `localStorage`.
- **Tema claro/escuro** — alternável e persistido, sem flash ao recarregar.
- **5 idiomas** — Português, Inglês, Espanhol, Chinês e Russo.

## Tipos de investimento

Renda fixa — Poupança, CDB, LCI/LCA, Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+ — cada um com sua base de rentabilidade (taxa fixa, % do CDI, % da Selic ou IPCA + spread), risco, liquidez, cobertura do FGC e tributação.

Renda variável e cripto — Ações B3, Fundos Imobiliários, ETF, Dólar e Criptomoedas, com **retorno anual esperado editável** e aviso de volatilidade. São tratados sem FGC e com a tributação própria de cada classe.

## Dados de mercado

O ticker da B3 e a página `/mercado` consomem APIs públicas direto do navegador, com **fallback** para um snapshot rotulado quando a API falha ou atinge o limite:

- **Criptomoedas** — [CoinGecko](https://www.coingecko.com/) (sem chave).
- **Câmbio / economias** — [AwesomeAPI](https://docs.awesomeapi.com.br/) (sem chave).
- **Ações B3** — [brapi.dev](https://brapi.dev). O token é **opcional**: defina-o em um arquivo `.env` (veja `.env.example`) para habilitar cotações ao vivo. Sem token, a B3 mostra um snapshot rotulado como "demonstração".

```bash
VITE_BRAPI_TOKEN=seu_token_aqui
```

> As cotações em planos gratuitos podem ter atraso (~15 min). A interface rotula o frescor de cada bloco (ao vivo / atrasado / demonstração) e nunca quebra offline.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (build e dev server)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- [Zustand](https://zustand.docs.pmnd.rs) (estado e preferências)
- [React Router](https://reactrouter.com) (navegação)
- [Recharts](https://recharts.org) (gráficos)
- [Vitest](https://vitest.dev) (testes)

## Como rodar

Pré-requisito: Node.js 20+.

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento em http://localhost:5173
```

## Scripts

| Script              | Descrição                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento com HMR        |
| `npm run build`     | Type-check (`tsc`) e build de produção     |
| `npm run preview`   | Pré-visualiza o build de produção          |
| `npm run lint`      | Análise estática com ESLint                |
| `npm test`          | Executa a suíte de testes uma vez          |
| `npm run test:watch`| Executa os testes em modo observação       |

## Estrutura

```
src/
├── components/
│   ├── ui/           Componentes base (shadcn/ui)
│   ├── layout/       Header, Sidebar, Footer, tema e idioma
│   ├── shared/       Componentes reutilizáveis (PageHeader, EmptyState)
│   ├── simulator/    Formulário, resumo e gráfico do simulador
│   ├── comparison/   Controles, gráfico e tabela de comparação
│   ├── market/       Ticker, cards, sparkline e seções de mercado
│   └── history/      Cartão de simulação salva
├── constants/        Dados dos investimentos e taxas de mercado
├── i18n/             Traduções e hook useTranslation
├── lib/              Cálculos financeiros, localStorage e utilidades
│   └── market/       Provedores de dados, hook de polling e formatação
├── pages/            Home, Simulator, Market, Comparison, History
├── store/            Estado da simulação e preferências (Zustand)
└── types/            Tipagens compartilhadas
```

## Lógica financeira

- **Juros compostos** com capitalização mensal; a taxa anual é convertida para a equivalente mensal.
- **Imposto de renda regressivo** aplicado apenas sobre o rendimento de aplicações tributáveis:

  | Prazo            | Alíquota |
  | ---------------- | -------- |
  | Até 180 dias     | 22,5%    |
  | 181 a 360 dias   | 20,0%    |
  | 361 a 720 dias   | 17,5%    |
  | Acima de 720 dias| 15,0%    |

  Poupança e LCI/LCA são isentas de IR. Renda variável e cripto usam alíquota fixa de 15%; FIIs são isentos sobre dividendos.

- **IOF regressivo** sobre o rendimento em resgates com menos de 30 dias (96% no 1º dia até 0% a partir do 30º).
- **Retorno real** — o valor final líquido também é apresentado em poder de compra, descontando a inflação anual estimada.
- **Planejador de meta** — dado um valor-alvo, resolve o aporte mensal necessário pela fórmula de anuidade.

## Testes

A suíte cobre o núcleo financeiro (`resolveAnnualRate`, `monthlyRateFromAnnual`, `incomeTaxRate`, `iofRate`, `applyInflation`, `solveMonthlyContribution`, `simulate`), os provedores de mercado (CoinGecko, AwesomeAPI, brapi), a formatação e a camada de persistência (`localStorage`).

```bash
npm test
```

> As simulações são estimativas e não constituem recomendação de investimento.

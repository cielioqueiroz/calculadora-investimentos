# InvestCalc

Calculadora de investimentos brasileira, com simulador de juros compostos, comparador, dados de mercado em tempo real e histórico. Tudo roda no navegador, sem backend, e pode ser hospedado de graça no GitHub Pages.

> As simulações são estimativas e não constituem recomendação de investimento.

## Destaques

- **Simulador completo**: juros compostos com aporte inicial, aportes mensais e prazo, já com IR regressivo, IOF de resgate curto, retorno real (descontando a inflação) e planejador de meta.
- **Mercado em tempo real**: ticker da B3 no topo, mais uma página `/mercado` com as principais economias do mundo (câmbio), criptomoedas e ações da B3, com mini-gráficos e indicador de frescor dos dados.
- **Renda fixa e renda variável**: da Poupança ao Tesouro, mais Ações, FIIs, ETF, Dólar e Criptomoedas com retorno esperado editável.
- **Comparador**: mesmo cenário aplicado a vários investimentos, com gráfico e tabela do melhor retorno líquido.
- **Histórico** persistido em `localStorage`, **tema claro/escuro** e **5 idiomas** (Português, Inglês, Espanhol, Chinês e Russo).
- **Animações** suaves com Framer Motion (contadores, entradas em stagger, hover), respeitando `prefers-reduced-motion`.

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| UI | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build | [Vite](https://vite.dev) |
| Estilo | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI) |
| Estado | [Zustand](https://zustand.docs.pmnd.rs) |
| Rotas | [React Router](https://reactrouter.com) |
| Gráficos | [Recharts](https://recharts.org) |
| Animação | [Motion](https://motion.dev) (Framer Motion) |
| Validação | [Zod](https://zod.dev) |
| Testes | [Vitest](https://vitest.dev) |

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install      # instala as dependências
npm run dev      # desenvolvimento em http://localhost:5173/calculadora-investimentos/
```

## Dados de mercado

O ticker da B3 e a página `/mercado` consomem APIs públicas direto do navegador, com fallback para um snapshot rotulado quando a API falha ou atinge o limite. A interface nunca quebra offline: ela degrada para o último dado bom e rotula o frescor de cada bloco (ao vivo, atrasado ou demonstração).

| Fonte | Dados | Chave |
| ----- | ----- | ----- |
| [CoinGecko](https://www.coingecko.com/) | Criptomoedas | Não |
| [AwesomeAPI](https://docs.awesomeapi.com.br/) | Câmbio e economias | Não |
| [brapi.dev](https://brapi.dev) | Ações B3 | Opcional |

As ações da B3 (brapi.dev) exigem um token gratuito. Há duas formas de informá-lo:

- **Na interface**: na página `/mercado`, cole o token no campo "Ativar ao vivo". Ele fica salvo no navegador (localStorage) e funciona inclusive no site publicado, sem rebuild.
- **No build**: copie `.env.example` para `.env` e preencha `VITE_BRAPI_TOKEN=seu_token_aqui`.

Sem token, a B3 aparece como demonstração. Cotações em planos gratuitos podem ter atraso de cerca de 15 minutos.

## Scripts

| Script | Descrição |
| ------ | --------- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Type-check (`tsc`) e build de produção |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Análise estática com ESLint |
| `npm test` | Executa a suíte de testes uma vez |
| `npm run test:watch` | Executa os testes em modo observação |

## Estrutura

```
src/
├── components/
│   ├── ui/           Componentes base (shadcn/ui)
│   ├── layout/       Header, ticker, sidebar, footer, tema e idioma
│   ├── shared/       Reutilizáveis (PageHeader, AnimatedNumber, EmptyState)
│   ├── simulator/    Formulário, resumo e gráfico do simulador
│   ├── comparison/   Controles, gráfico e tabela de comparação
│   ├── market/       Cards, sparkline e seções de mercado
│   └── history/      Cartão de simulação salva
├── constants/        Catálogo de investimentos e taxas de mercado
├── i18n/             Traduções e hook useTranslation
├── lib/              Cálculos financeiros, animações, localStorage e utilidades
│   └── market/       Provedores de dados, hook de polling e formatação
├── pages/            Home, Simulator, Market, Comparison, History
├── store/            Estado da simulação e preferências (Zustand)
└── types/            Tipagens compartilhadas
```

## Lógica financeira

Juros compostos com capitalização mensal: a taxa anual é convertida para a equivalente mensal.

Imposto de renda regressivo, aplicado só sobre o rendimento de aplicações tributáveis:

| Prazo | Alíquota |
| ----- | -------- |
| Até 180 dias | 22,5% |
| 181 a 360 dias | 20,0% |
| 361 a 720 dias | 17,5% |
| Acima de 720 dias | 15,0% |

Poupança e LCI/LCA são isentas. Renda variável e cripto usam alíquota fixa de 15%, e FIIs são isentos sobre dividendos.

Outros mecanismos:

- **IOF regressivo** sobre o rendimento em resgates com menos de 30 dias (96% no primeiro dia até 0% a partir do trigésimo).
- **Retorno real**: o valor final líquido também é apresentado em poder de compra, descontando a inflação anual estimada.
- **Planejador de meta**: dado um valor-alvo, o app resolve o aporte mensal necessário pela fórmula de anuidade.

## Acessibilidade e performance

- Todas as animações respeitam `prefers-reduced-motion` (via `MotionConfig reducedMotion="user"` e `useReducedMotion`).
- O ticker pausa no hover e não rola para quem prefere menos movimento.
- O polling de mercado pausa quando a aba está em segundo plano, para poupar requisições.

## Testes

A suíte cobre o núcleo financeiro (`resolveAnnualRate`, `monthlyRateFromAnnual`, `incomeTaxRate`, `iofRate`, `applyInflation`, `solveMonthlyContribution`, `simulate`), os provedores de mercado (CoinGecko, AwesomeAPI, brapi), a formatação e a camada de persistência (`localStorage`).

```bash
npm test
```

## Deploy

O projeto é estático e está configurado para o GitHub Pages com `base: '/calculadora-investimentos/'`. O workflow em `.github/workflows/deploy.yml` faz o build e publica a cada push na branch principal. Nenhum segredo vai para o bundle: o token da B3 é opcional e fica no `.env` local de cada deploy.

# Rendimento

Calculadora de investimentos brasileira. Projeta juros compostos já com IR, IOF e inflação descontados, compara aplicações no mesmo cenário e mostra cotações de câmbio, cripto e B3. Roda inteira no navegador, sem backend.

**rendimento-omega.vercel.app**

![Rendimento](public/og-image.png)

> As simulações são estimativas e não constituem recomendação de investimento.

## O que faz

A calculadora ocupa a página inicial. Você escolhe a aplicação, informa valor inicial, aporte mensal e prazo, e vê o valor final líquido, o rendimento, o imposto e a evolução mês a mês. No modo "planejar meta" o cálculo inverte: dado um valor-alvo, ele resolve o aporte mensal necessário.

Onze aplicações estão cadastradas, da poupança ao Tesouro IPCA+, mais ações, FIIs, ETF, dólar e cripto — estas com retorno esperado editável, já que não existe taxa contratada.

`/comparar` roda o mesmo cenário em várias aplicações e ordena pelo retorno líquido. `/mercado` lista câmbio, cripto e B3 com variação do dia e minigráfico. `/historico` guarda as simulações salvas no `localStorage` do navegador.

## Capturas

| Calculadora | Mercado |
| ----------- | ------- |
| ![Calculadora](screenshots/calculadora_desktop.png) | ![Mercado](screenshots/mercado_desktop.png) |

| Comparar | Mobile |
| -------- | ------ |
| ![Comparar](screenshots/comparar_desktop.png) | ![Mobile](screenshots/mercado_mobile.png) |

## Rodando

Node.js 20 ou superior.

```bash
npm install
npm run dev
```

| Script | O que faz |
| ------ | --------- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Type-check e build de produção |
| `npm run preview` | Serve o build local |
| `npm run lint` | ESLint |
| `npm test` | Suíte de testes |
| `npm run fetch:b3` | Gera o snapshot de cotações da B3 |

## Cálculos

Juros compostos com capitalização mensal — a taxa anual informada é convertida para a mensal equivalente antes de compor.

O imposto de renda segue a tabela regressiva, incidindo apenas sobre o rendimento:

| Prazo | Alíquota |
| ----- | -------- |
| Até 180 dias | 22,5% |
| 181 a 360 dias | 20,0% |
| 361 a 720 dias | 17,5% |
| Acima de 720 dias | 15,0% |

Poupança, LCI/LCA e dividendos de FII são isentos. Ações, ETF, dólar e cripto usam alíquota fixa de 15%.

Resgates com menos de 30 dias também pagam IOF sobre o rendimento, de 96% no primeiro dia a 0% a partir do trigésimo. O valor final aparece ainda em poder de compra, descontando a inflação anual informada, e o planejador de meta resolve o aporte pela fórmula de anuidade.

Os testes cobrem esse núcleo — `resolveAnnualRate`, `monthlyRateFromAnnual`, `incomeTaxRate`, `iofRate`, `applyInflation`, `solveMonthlyContribution` e `simulate` — além dos provedores de mercado, da formatação e da persistência.

## Cotações

As cotações vêm de APIs públicas chamadas direto do navegador. Quando uma delas falha ou estoura o limite, a interface cai para o último dado bom e rotula o bloco como atrasado ou demonstração, em vez de quebrar.

| Fonte | Dados | Token |
| ----- | ----- | ----- |
| [AwesomeAPI](https://docs.awesomeapi.com.br/) | Câmbio | Não |
| [CoinGecko](https://www.coingecko.com/) | Cripto | Não |
| [brapi.dev](https://brapi.dev) | Ações da B3 | Sim, gratuito |

O plano gratuito da brapi permite um ativo por requisição, então as ações não são buscadas a cada visita: o build gera `public/market/b3.json` uma vez e todo mundo lê esse arquivo. Para ver ao vivo localmente:

```bash
BRAPI_TOKEN=seu_token npm run fetch:b3
npm run dev
```

## Deploy

Hospedado na Vercel. O `vercel.json` roda `fetch:b3` antes do build e reescreve todas as rotas para `index.html`, que é o que uma SPA precisa.

Para que as cotações da B3 não envelheçam entre um push e outro, o workflow `refresh-market.yml` dispara um Deploy Hook a cada 15 minutos durante o pregão. Ele precisa de dois segredos:

- `BRAPI_TOKEN` nas variáveis de ambiente da Vercel, para o build gerar o snapshot;
- `VERCEL_DEPLOY_HOOK` nos segredos do repositório, com a URL do hook criada em Settings > Git > Deploy Hooks.

Sem eles nada quebra: a B3 aparece rotulada como demonstração e o workflow sai sem fazer nada.

## Stack

React 19 e TypeScript sobre Vite, Tailwind com componentes shadcn/ui (Radix), Zustand para estado, React Router, Recharts nos gráficos, Zod validando as respostas das APIs, Motion nos contadores e Vitest nos testes.

```
src/
├── components/
│   ├── ui/           Base (shadcn/ui)
│   ├── layout/       Header, ticker, sidebar, footer, tema e idioma
│   ├── shared/       PageHeader, AnimatedNumber, EmptyState, Guilloche
│   ├── simulator/    Formulário, resultado e gráfico
│   ├── comparison/   Controles, gráfico, tabela e catálogo
│   ├── market/       Ticker, tabela e sparkline
│   └── history/      Cartão de simulação salva
├── constants/        Catálogo de aplicações e taxas
├── i18n/             Traduções (pt, en)
├── lib/              Cálculos, localStorage, navegação e utilidades
│   └── market/       Provedores, polling e formatação
├── pages/            Simulator, Market, Comparison, History
├── store/            Simulação e preferências (Zustand)
└── types/            Tipos compartilhados
```

Toda animação respeita `prefers-reduced-motion`, o ticker pausa no hover e o polling de mercado para quando a aba sai de foco.

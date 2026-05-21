# InvestCalc

Calculadora de investimentos de renda fixa. Simule o crescimento de uma aplicação com aportes mensais, compare diferentes investimentos no mesmo cenário e salve suas simulações — tudo no navegador, sem backend.

## Funcionalidades

- **Simulador** — projeção de juros compostos com aporte inicial, aportes mensais e prazo, já com o desconto do imposto de renda regressivo.
- **Comparação** — aplica o mesmo cenário a vários investimentos e destaca o melhor retorno líquido em gráfico e tabela.
- **Histórico** — salva, reabre e remove simulações, persistidas em `localStorage`.
- **Tema claro/escuro** — alternável e persistido, sem flash ao recarregar.
- **5 idiomas** — Português, Inglês, Espanhol, Chinês e Russo.

## Tipos de investimento

Poupança, CDB, LCI/LCA, Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+, cada um com sua base de rentabilidade (taxa fixa, % do CDI, % da Selic ou IPCA + spread), risco, liquidez, cobertura do FGC e tributação.

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
│   └── history/      Cartão de simulação salva
├── constants/        Dados dos investimentos e taxas de mercado
├── i18n/             Traduções e hook useTranslation
├── lib/              Cálculos financeiros, localStorage e utilidades
├── pages/            Home, Simulator, Comparison, History
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

Poupança e LCI/LCA são isentas de IR.

## Testes

A suíte cobre o núcleo financeiro (`resolveAnnualRate`, `monthlyRateFromAnnual`, `incomeTaxRate`, `simulate`) e a camada de persistência (`localStorage`).

```bash
npm test
```

> As simulações são estimativas e não constituem recomendação de investimento.

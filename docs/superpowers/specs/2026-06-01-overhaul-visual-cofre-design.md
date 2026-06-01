# Overhaul visual — Conceito "Cofre" (private bank)

Data: 2026-06-01
Status: aprovado para planejamento

## Objetivo

Elevar o visual da calculadora de investimentos de um shadcn/ui genérico para
uma estética premium de **private bank brasileiro**. A tela deve evocar um
**certificado/título de valor**: papel-moeda gravado, ouro champanhe metálico e
números em serif elegante.

**Elemento memorável:** valores em dinheiro renderizados em Fraunces com brilho
dourado sutil, sobre fundo com textura gravada (guilloché).

Escopo: **overhaul completo** — paleta, tipografia, atmosfera, todos os
componentes base, todas as páginas, sidebar/header e favicon.

Temas: **dark-first** (estrela), mantendo um tema **claro** premium à altura.

## Princípios

- Ouro **champanhe metálico**, nunca amarelo neon (`#FFD700` está banido).
- Esmeralda e terracota refinados no lugar de verde/vermelho berrantes.
- Números financeiros sempre em algarismos tabulares (`tabular-nums`).
- Luxo = contenção e precisão: raio menor, hairlines, sombras suaves e profundas.
- Convenções do projeto mantidas: código/identificadores em inglês, textos de UI
  via i18n (PT/EN), rotas em PT, commits em PT.

## 1. Tokens de cor

Os valores abaixo são a referência; HSL final pode ser afinado na implementação.
O sistema atual usa triplets HSL em variáveis CSS (`src/index.css`) — manter esse
formato.

### Dark (padrão)

| Token | Hex ref | HSL ref | Uso |
|---|---|---|---|
| background | `#0B0C0E` | `228 11% 5%` | fundo da app |
| card | `#15161A` | `228 11% 9%` | painéis/cards |
| popover | `#15161A` | `228 11% 9%` | tooltips/menus |
| foreground | `#ECE7DA` | `42 28% 89%` | texto principal (marfim quente) |
| muted-foreground | `#9A968C` | `42 6% 58%` | texto secundário |
| primary (ouro) | `#C9A24B` | `41 54% 54%` | acento sólido / texto-ouro |
| primary-foreground | `#0B0C0E` | `228 11% 5%` | texto sobre ouro |
| success (esmeralda) | `#3FB984` | `156 50% 49%` | ganhos/positivo |
| destructive (terracota) | `#D4785A` | `15 58% 59%` | imposto/negativo |
| border | `rgba(ouro,12%)` | usar `42 40% 60% / 0.12` | hairline dourada |
| input | idem border | | bordas de campo |
| ring | primary | | foco dourado |

Gradiente metálico do ouro (botões, sheen, gráficos):
`linear-gradient(135deg, #E8C77A 0%, #C9A24B 55%, #A8842F 100%)`.

### Light (papelaria de luxo)

| Token | Hex ref | Uso |
|---|---|---|
| background | `#F7F3EA` | creme/marfim, não branco |
| card | `#FFFDF8` | papel levemente mais claro |
| foreground | `#1A1A1F` | tinta |
| muted-foreground | `#6B6760` | |
| primary (ouro) | `#A8842F` | ouro escurecido p/ contraste AA |
| success | `#1E9E6A` | esmeralda mais escura |
| destructive | `#B85A3C` | terracota mais escura |
| border | `rgba(ouro,18%)` | hairline |

Contraste: garantir AA (≥4.5:1) para texto de corpo em ambos os temas. Ouro só
em texto grande/decorativo ou sobre fundo escuro; em texto pequeno usar
foreground.

## 2. Tipografia

- **Fraunces** (variável, optical sizing) → títulos (`h1`–`h3`) e números grandes
  de dinheiro. Peso ~500–600, leve `opsz` alto em títulos.
- **Geist** → corpo, labels, botões, inputs, navegação.
- Algarismos tabulares: utilitário (ex. classe `.tabular`/`font-variant-numeric:
  tabular-nums`) aplicado a todo valor monetário e percentual.
- Carregamento: fontes locais via `@fontsource` (Fraunces + Geist) ou self-host;
  `font-display: swap`; subset latino. Evitar bloquear render.
- Atualizar `tailwind.config.js` com `fontFamily.display` (Fraunces) e
  `fontFamily.sans` (Geist).

## 3. Atmosfera e detalhes assinatura

- **Textura guilloché**: padrão SVG/CSS sutil (linhas gravadas tipo cédula) como
  background de hero e de cards-destaque. Opacidade baixa (~4–8%), reage ao tema.
  Implementar como SVG reutilizável (ex. `src/components/shared/Guilloche.tsx`
  ou um background CSS em `index.css`).
- **Glow radial dourado** atrás do hero (radial-gradient suave).
- **Grão de filme** leve no fundo da app (overlay SVG noise, pointer-events none).
- Sombras profundas e suaves (definir `--shadow-soft`); raio base `0.5rem`
  (reduzir `--radius` de `0.75rem`).
- Botão primário: gradiente ouro + texto escuro + `hover` com leve elevação/sheen.
- Inputs: foco com ring dourado; bordas hairline.

## 4. Componentes

| Componente | Mudança |
|---|---|
| `ui/button` | variante `default` com gradiente ouro + texto escuro + hover lift; manter outras variantes coerentes |
| `ui/card` | borda hairline dourada, sombra suave; prop/variação "destaque" com fundo guilloché |
| `ui/input`, `ui/select`, `ui/label`, `ui/dialog`, `ui/badge` | reskin para nova paleta, foco dourado, raio menor |
| `simulator/ResultSummary` | "Saldo líquido" vira herói: número gigante em Fraunces com sheen dourado; demais itens em grid refinado, valores tabulares |
| `simulator/GrowthChart` | trocar `#FFD700`/`#818CF8` por gradiente ouro + esmeralda; grid hairline; tooltip vidro escuro; legenda refinada |
| `comparison/ComparisonChart` + `ComparisonTable` | mesma paleta ouro/esmeralda; tabela com números tabulares e hairlines |
| `layout/Sidebar` | item ativo com **marca dourada lateral** (barra) em vez do bloco `bg-primary/15` |
| `layout/Header` | logo/marca refinada com ouro; backdrop blur mantido |
| `shared/EmptyState`, `shared/PageHeader` | aplicar tipografia display + tom premium |

## 5. Páginas

- **Home**: hero com fundo guilloché + glow dourado + manchete em Fraunces; cards
  de features e de tipos de investimento no novo sistema.
- **Simulator**, **Comparison**, **History**: aplicar sistema completo
  (cards, gráficos, tabelas, tipografia, espaçamento).

## 6. Favicon

Redesenhar `public/favicon.svg` para combinar com o novo visual: marca em ouro
champanhe (gradiente metálico) sobre fundo obsidiana, alinhada ao símbolo usado
no Header. Atualizar também qualquer `theme-color`/meta relevante no `index.html`
se necessário.

## 7. Fora de escopo

- Mudanças de lógica de cálculo, dados, i18n (conteúdo), rotas ou store.
- Novas funcionalidades. Este overhaul é puramente visual/estético.

## 8. Critérios de sucesso

- Nenhum uso remanescente de `#FFD700` / `#818CF8`.
- Fraunces + Geist carregando e aplicados (títulos/números vs. corpo).
- Ambos os temas (dark/light) coesos e com contraste AA no texto de corpo.
- Textura guilloché + ouro champanhe presentes no hero e destaques.
- Favicon novo coerente com a marca.
- Build (`vite build`) e testes existentes passando; sem regressão funcional.

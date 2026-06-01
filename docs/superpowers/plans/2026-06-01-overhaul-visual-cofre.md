# Overhaul Visual "Cofre" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o visual da calculadora de investimentos num private bank premium (conceito "Cofre"): ouro champanhe metálico, esmeralda/terracota, tipografia Fraunces/Geist, textura guilloché e favicon coerente, em dark-first com tema claro à altura.

**Architecture:** Trabalho puramente de UI sobre React 19 + Vite + Tailwind 3 + shadcn/ui. A base do sistema (tokens de cor em variáveis CSS, fontes, atmosfera) é definida primeiro em `src/index.css` e `tailwind.config.js`; depois os componentes `ui/*` e de layout são reskinados; por fim as páginas e o favicon. Nenhuma lógica de cálculo, store, i18n ou rota muda.

**Tech Stack:** React 19, TypeScript, Vite 8, TailwindCSS 3.4, shadcn/ui, recharts 3, @fontsource(-variable) para fontes self-hosted.

**Verificação (vale para todo o plano):** Como é trabalho visual, a "prova" de cada task é:
- `npm run build` (roda `tsc -b && vite build`) sem erros de tipo/build.
- `npm run lint` sem novos erros.
- `npm test` (vitest) — testes existentes de `calculations` e `localStorage` continuam verdes.
- Conferência visual no `npm run dev` (descrita por task).
Os testes unitários existentes NÃO devem ser alterados; este overhaul não adiciona testes unitários porque o produto é estético.

---

## Estrutura de arquivos

**Modificados:**
- `src/index.css` — tokens de cor (dark+light), `--radius`, sombras, base tipográfica, overlay de grão.
- `tailwind.config.js` — `fontFamily.display`/`sans`, `colors` (gold scale opcional), `boxShadow`, `backgroundImage` (guilloché/grão), keyframes extra.
- `index.html` — import de fontes (ou via main.tsx), `theme-color`, script de tema mantido.
- `src/main.tsx` — imports `@fontsource-variable/*`.
- `src/components/ui/{button,card,input,select,label,dialog,badge}.tsx` — reskin.
- `src/components/layout/{Header,Sidebar,ThemeToggle,Footer}.tsx` — refino.
- `src/components/simulator/{ResultSummary,GrowthChart}.tsx` — herói + gráfico.
- `src/components/comparison/{ComparisonChart,ComparisonTable}.tsx` — recolor.
- `src/components/shared/{PageHeader,EmptyState}.tsx` — tipografia premium.
- `src/pages/{Home,Simulator,Comparison,History}.tsx` — aplicação do sistema.
- `public/favicon.svg` — redesenho.

**Criados:**
- `src/components/shared/Guilloche.tsx` — componente de textura gravada reutilizável.

---

## Task 1: Fontes Fraunces + Geist

**Files:**
- Modify: `package.json` (deps)
- Modify: `src/main.tsx`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Instalar as fontes self-hosted**

Run:
```bash
npm install @fontsource-variable/fraunces @fontsource-variable/geist
```
Expected: instala sem erro. Se o nome `@fontsource-variable/geist` não existir no registry, usar fallback: `npm install @fontsource-variable/geist-sans` e ajustar o import do Step 2 para `@fontsource-variable/geist-sans`. Confirmar o caminho instalado em `node_modules/@fontsource-variable/`.

- [ ] **Step 2: Importar as fontes no entrypoint**

Em `src/main.tsx`, adicionar no topo (após os imports existentes de React/estilos, antes do render):
```ts
import '@fontsource-variable/fraunces'
import '@fontsource-variable/geist'
```
(usar o nome do pacote realmente instalado no Step 1).

- [ ] **Step 3: Registrar as famílias no Tailwind**

Em `tailwind.config.js`, dentro de `theme.extend`, adicionar:
```js
fontFamily: {
  sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  display: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
},
```

- [ ] **Step 4: Aplicar Geist como fonte base**

Em `src/index.css`, no `@layer base` do `body`, garantir a família. Trocar o bloco `body`:
```css
  body {
    @apply bg-background text-foreground antialiased font-sans;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
```

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: build OK. No `npm run dev`, o corpo do texto deve renderizar em Geist (sans geométrica), sem FOUT bloqueante.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/main.tsx tailwind.config.js src/index.css
git commit -m "Adiciona fontes Fraunces e Geist ao sistema visual"
```

---

## Task 2: Tokens de cor, raio e sombras (dark + light)

**Files:**
- Modify: `src/index.css:6-54` (blocos `:root` e `.dark`)
- Modify: `tailwind.config.js` (boxShadow)

- [ ] **Step 1: Substituir as variáveis do tema claro**

Em `src/index.css`, substituir o bloco `:root { ... }` por:
```css
  :root {
    --background: 42 38% 94%;
    --foreground: 240 9% 11%;
    --card: 44 50% 98%;
    --card-foreground: 240 9% 11%;
    --popover: 44 50% 98%;
    --popover-foreground: 240 9% 11%;
    --primary: 38 56% 42%;
    --primary-foreground: 44 50% 98%;
    --secondary: 42 24% 88%;
    --secondary-foreground: 240 9% 14%;
    --muted: 42 24% 88%;
    --muted-foreground: 40 6% 40%;
    --accent: 42 28% 86%;
    --accent-foreground: 240 9% 14%;
    --destructive: 14 56% 48%;
    --destructive-foreground: 44 50% 98%;
    --success: 156 64% 34%;
    --success-foreground: 44 50% 98%;
    --border: 38 30% 78%;
    --input: 38 30% 78%;
    --ring: 38 56% 42%;
    --radius: 0.5rem;
  }
```

- [ ] **Step 2: Substituir as variáveis do tema escuro**

Substituir o bloco `.dark { ... }` por:
```css
  .dark {
    --background: 228 11% 5%;
    --foreground: 42 28% 89%;
    --card: 228 11% 9%;
    --card-foreground: 42 28% 89%;
    --popover: 228 12% 10%;
    --popover-foreground: 42 28% 89%;
    --primary: 41 54% 54%;
    --primary-foreground: 228 11% 5%;
    --secondary: 228 10% 16%;
    --secondary-foreground: 42 28% 89%;
    --muted: 228 9% 15%;
    --muted-foreground: 40 6% 58%;
    --accent: 228 10% 16%;
    --accent-foreground: 42 28% 89%;
    --destructive: 15 58% 59%;
    --destructive-foreground: 228 11% 5%;
    --success: 156 50% 49%;
    --success-foreground: 228 11% 5%;
    --border: 42 35% 60%;
    --input: 228 10% 20%;
    --ring: 41 54% 54%;
    --radius: 0.5rem;
  }
```
Nota: `--border` em tom ouro mas será usado com baixa opacidade nos componentes (ex. `border-border/15`); onde hoje há `border-border` cheio, trocaremos para opacidade reduzida nas tasks de componente.

- [ ] **Step 3: Atualizar o `color-scheme` default**

Em `src/index.css`, o `html { color-scheme: light; }` permanece; o `html.dark` permanece. Sem mudança aqui — apenas confirmar.

- [ ] **Step 4: Adicionar sombras suaves no Tailwind**

Em `tailwind.config.js` → `theme.extend`, adicionar:
```js
boxShadow: {
  soft: '0 1px 2px hsl(0 0% 0% / 0.04), 0 8px 24px -8px hsl(0 0% 0% / 0.18)',
  'soft-lg': '0 2px 4px hsl(0 0% 0% / 0.06), 0 24px 48px -12px hsl(0 0% 0% / 0.30)',
  gold: '0 8px 24px -6px hsl(41 54% 40% / 0.35)',
},
```

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: OK. No dev, dark = obsidiana quente com texto marfim; ouro champanhe (não neon) nos botões/acentos; light = creme com tinta. Trocar tema pelo toggle e confirmar ambos coerentes.

- [ ] **Step 6: Commit**

```bash
git add src/index.css tailwind.config.js
git commit -m "Redefine paleta para ouro champanhe, esmeralda e terracota nos dois temas"
```

---

## Task 3: Atmosfera — grão de filme e textura guilloché

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js` (backgroundImage)
- Create: `src/components/shared/Guilloche.tsx`

- [ ] **Step 1: Adicionar overlay de grão no fundo da app**

Em `src/index.css`, dentro de `@layer base`, após o bloco `body`, adicionar:
```css
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
```
Garantir que o conteúdo principal fique acima: em `src/components/layout/AppLayout.tsx`, no `div` raiz, acrescentar `relative z-10` às classes existentes (`flex min-h-screen flex-col bg-background` → `relative z-10 flex min-h-screen flex-col bg-background`).

- [ ] **Step 2: Registrar gradientes utilitários no Tailwind**

Em `tailwind.config.js` → `theme.extend`, adicionar:
```js
backgroundImage: {
  'gold-metal': 'linear-gradient(135deg, hsl(42 70% 69%) 0%, hsl(41 54% 54%) 55%, hsl(38 56% 38%) 100%)',
  'hero-glow': 'radial-gradient(120% 120% at 80% -10%, hsl(41 54% 54% / 0.18) 0%, transparent 55%)',
},
```

- [ ] **Step 3: Criar o componente Guilloche**

Create `src/components/shared/Guilloche.tsx`:
```tsx
import { cn } from '@/lib/utils'

interface GuillocheProps {
  className?: string
}

/**
 * Engraved banknote-style texture. Decorative only.
 * Renders concentric guilloché arcs in the current gold tone at low opacity.
 */
export function Guilloche({ className }: GuillocheProps) {
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 600 400"
      fill="none"
    >
      <defs>
        <pattern id="guilloche" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="20" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="24" cy="24" r="13" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="0" cy="0" r="20" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
          <circle cx="48" cy="48" r="20" stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#guilloche)" />
    </svg>
  )
}
```

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: OK. No dev, fundo tem grão sutil; o componente `Guilloche` compila (será usado na Task 8/10).

- [ ] **Step 5: Commit**

```bash
git add src/index.css tailwind.config.js src/components/shared/Guilloche.tsx src/components/layout/AppLayout.tsx
git commit -m "Adiciona grao de filme e textura guilloche reutilizavel"
```

---

## Task 4: Reskin do Button (gradiente ouro)

**Files:**
- Modify: `src/components/ui/button.tsx:11-20`

- [ ] **Step 1: Atualizar a variante `default` e `outline`**

Em `src/components/ui/button.tsx`, no objeto `variant`, substituir as entradas `default` e `outline` por:
```ts
        default:
          'bg-gold-metal text-primary-foreground font-semibold shadow-gold transition-all hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-primary/40 bg-transparent text-foreground hover:border-primary hover:bg-primary/10',
```
(manter `secondary`, `ghost`, `link` como estão, mas trocar a base de transição: na string raiz do `cva`, onde está `transition-colors`, deixar `transition-colors` — o `default` já sobrescreve com `transition-all`).

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: OK. No dev, botão primário = gradiente ouro metálico com texto escuro e leve elevação no hover; `outline` com borda dourada.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.tsx
git commit -m "Aplica gradiente ouro metalico ao botao primario"
```

---

## Task 5: Reskin do Card (hairline + sombra + destaque)

**Files:**
- Modify: `src/components/ui/card.tsx:11-14`

- [ ] **Step 1: Atualizar a base do Card**

Em `src/components/ui/card.tsx`, na `cn(...)` do componente `Card`, substituir a string de classes por:
```ts
      'rounded-lg border border-border/15 bg-card text-card-foreground shadow-soft',
```

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: OK. Cards com borda hairline dourada (baixa opacidade) e sombra suave/profunda em vez de `shadow-sm`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/card.tsx
git commit -m "Aplica hairline dourada e sombra suave aos cards"
```

---

## Task 6: Reskin dos campos (input, select, label, dialog, badge)

**Files:**
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/select.tsx`
- Modify: `src/components/ui/dialog.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/label.tsx`

- [ ] **Step 1: Ler os arquivos e localizar as strings de borda/foco**

Run: `npm run dev` em paralelo para conferência. Abrir cada arquivo; eles seguem o padrão shadcn (string única de classes na raiz do componente).

- [ ] **Step 2: Input — foco dourado e hairline**

Em `src/components/ui/input.tsx`, na string de classes do `<input>`, garantir que contenha `border-input` → trocar por `border-border/20` e que o focus use o ring (já é `focus-visible:ring-ring`). Acrescentar `bg-card/60` se o fundo estiver `bg-background`. Resultado da classe de borda/fundo:
```
'... border border-border/20 bg-card/60 ... focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ...'
```
(preservar todo o resto da string original).

- [ ] **Step 3: Select — mesmo tratamento do trigger**

Em `src/components/ui/select.tsx`, no `SelectTrigger`, trocar `border-input` por `border-border/20` e fundo para `bg-card/60`. No `SelectContent`, garantir `border-border/15` e `shadow-soft-lg`.

- [ ] **Step 4: Dialog — overlay e painel premium**

Em `src/components/ui/dialog.tsx`: no `DialogOverlay`, manter `bg-black/80` (ou trocar para `bg-black/70 backdrop-blur-sm`). No `DialogContent`, trocar `border` para `border-border/15` e `shadow-lg` para `shadow-soft-lg`.

- [ ] **Step 5: Badge — variantes coerentes**

Em `src/components/ui/badge.tsx`, garantir variantes:
```ts
        default: 'border-transparent bg-primary/15 text-primary',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        success: 'border-transparent bg-success/15 text-success',
        destructive: 'border-transparent bg-destructive/15 text-destructive',
```
(adaptar à estrutura `cva` existente; manter `outline` se existir).

- [ ] **Step 6: Label — sem mudança estrutural**

Em `src/components/ui/label.tsx`, apenas confirmar que usa `text-foreground`/`text-sm font-medium`. Se usar cor fixa, deixar herdar. Nenhuma mudança obrigatória.

- [ ] **Step 7: Verificar**

Run: `npm run build` e conferir o formulário do Simulador no dev: campos com borda hairline, foco dourado, badges com fundo translúcido na cor certa.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/input.tsx src/components/ui/select.tsx src/components/ui/dialog.tsx src/components/ui/badge.tsx src/components/ui/label.tsx
git commit -m "Reskin de inputs, select, dialog e badges para a paleta Cofre"
```

---

## Task 7: Header, Sidebar, ThemeToggle e Footer

**Files:**
- Modify: `src/components/layout/Header.tsx:19-33`
- Modify: `src/components/layout/Sidebar.tsx:17-38`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Header — marca em ouro e título display**

Em `src/components/layout/Header.tsx`, substituir o `<header>` de abertura por:
```tsx
    <header className="sticky top-0 z-40 border-b border-border/15 bg-background/70 backdrop-blur-xl">
```
E o bloco da marca (ícone + título), trocar o `<span>` do ícone e o título:
```tsx
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-metal text-primary-foreground shadow-gold">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight text-foreground">
              InvestCalc
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t('header.tagline')}
            </span>
          </div>
```

- [ ] **Step 2: Sidebar — marca dourada lateral no item ativo**

Em `src/components/layout/Sidebar.tsx`, trocar o `<aside>` para `bg-card/30` e a função de classe do `NavLink` por:
```tsx
    <aside className="hidden w-64 shrink-0 border-r border-border/15 bg-card/30 md:block">
```
```tsx
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                'before:absolute before:left-0 before:top-1/2 before:h-0 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:transition-all',
                isActive
                  ? 'text-primary before:h-5'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )
            }
```

- [ ] **Step 3: Footer — refino leve**

Em `src/components/layout/Footer.tsx`, trocar a borda para `border-border/15` e garantir texto em `text-muted-foreground text-sm`. Sem reescrever conteúdo.

- [ ] **Step 4: Verificar**

Run: `npm run build` e dev: header com marca dourada e título em Fraunces; sidebar com barrinha dourada deslizando no item ativo.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Sidebar.tsx src/components/layout/Footer.tsx
git commit -m "Refina header e sidebar com marca dourada e tipografia display"
```

---

## Task 8: ResultSummary — saldo líquido como herói

**Files:**
- Modify: `src/components/simulator/ResultSummary.tsx`

- [ ] **Step 1: Separar o item de destaque dos demais e renderizar o herói**

Em `src/components/simulator/ResultSummary.tsx`, substituir o `return (...)` por:
```tsx
  const highlight = items.find((i) => i.highlight)!
  const rest = items.filter((i) => !i.highlight)

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-primary/30">
        <Guilloche className="opacity-[0.06]" />
        <CardContent className="relative flex items-end justify-between gap-4 p-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {highlight.label}
            </p>
            <p className="bg-gold-metal bg-clip-text font-display text-4xl font-semibold tabular-nums text-transparent md:text-5xl">
              {highlight.value}
            </p>
          </div>
          <highlight.icon className="h-8 w-8 shrink-0 text-primary" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {rest.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex items-start justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className={`font-display text-2xl font-semibold tabular-nums ${tone}`}>
                  {value}
                </p>
              </div>
              <Icon className={`h-5 w-5 ${tone}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
```

- [ ] **Step 2: Adicionar o import do Guilloche**

No topo de `src/components/simulator/ResultSummary.tsx`, adicionar:
```tsx
import { Guilloche } from '@/components/shared/Guilloche'
```

- [ ] **Step 3: Verificar**

Run: `npm run build`. No dev (Simulador, após simular): "Saldo líquido" aparece como número gigante em Fraunces com preenchimento ouro (bg-clip-text) sobre textura guilloché; demais itens em grid de 3, números tabulares.
Nota: `bg-clip-text text-transparent` exige `bg-gold-metal` (Task 3 Step 2) registrado. Se o gradiente não aparecer no texto, confirmar a classe `backgroundImage` no Tailwind.

- [ ] **Step 4: Commit**

```bash
git add src/components/simulator/ResultSummary.tsx
git commit -m "Transforma saldo liquido no numero heroi em Fraunces dourado"
```

---

## Task 9: Gráficos e tabela (cores ouro/esmeralda)

**Files:**
- Modify: `src/components/simulator/GrowthChart.tsx:42-99`
- Modify: `src/components/comparison/ComparisonChart.tsx`
- Modify: `src/components/comparison/ComparisonTable.tsx`

- [ ] **Step 1: Recolorir o GrowthChart**

Em `src/components/simulator/GrowthChart.tsx`, trocar todas as cores fixas:
- `#FFD700` → `hsl(41 54% 54%)` (ouro) nos `stop`, `stroke` da área `grossBalance`.
- `#818CF8` → `hsl(156 50% 49%)` (esmeralda) nos `stop`, `stroke` e na legenda `bg-[#818CF8]` → `bg-success`.
Especificamente:
```tsx
                <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(41 54% 54%)" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="hsl(41 54% 54%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(156 50% 49%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(156 50% 49%)" stopOpacity={0} />
                </linearGradient>
```
```tsx
              <Area type="monotone" dataKey="invested" stroke="hsl(156 50% 49%)" strokeWidth={2} fill="url(#fillInvested)" />
              <Area type="monotone" dataKey="grossBalance" stroke="hsl(41 54% 54%)" strokeWidth={2} fill="url(#fillBalance)" />
```
E na legenda, trocar `bg-[#818CF8]` por `bg-success`.

- [ ] **Step 2: ComparisonChart — usar as cores da paleta**

Em `src/components/comparison/ComparisonChart.tsx`, localizar cores fixas. As séries por tipo de investimento devem usar `type.color` de `INVESTMENT_TYPES` quando aplicável; qualquer cor fixa de UI (grid/eixos/tooltip) deve usar `hsl(var(--border))`, `hsl(var(--muted-foreground))` e `hsl(var(--popover))` como já faz o GrowthChart. Substituir quaisquer `#FFD700`/`#818CF8`/hex genéricos remanescentes por tokens ou por `type.color`.

- [ ] **Step 3: ComparisonTable — hairlines e números tabulares**

Em `src/components/comparison/ComparisonTable.tsx`, nas células/linhas: trocar bordas para `border-border/15`, adicionar `tabular-nums` às células de valor monetário/percentual, e usar `font-display` apenas no total/destaque se houver. Cabeçalho em `text-xs uppercase tracking-wider text-muted-foreground`.

- [ ] **Step 4: Verificar**

Run: `npm run build`. No dev, gráfico de crescimento em ouro+esmeralda; comparação coerente; tabela com números alinhados (tabular). Buscar no projeto por cores banidas (Task 13).

- [ ] **Step 5: Commit**

```bash
git add src/components/simulator/GrowthChart.tsx src/components/comparison/ComparisonChart.tsx src/components/comparison/ComparisonTable.tsx
git commit -m "Recolore graficos e tabela para ouro e esmeralda"
```

---

## Task 10: Home — hero gravado e cards

**Files:**
- Modify: `src/pages/Home.tsx:38-75`

- [ ] **Step 1: Hero com guilloché + glow + manchete display**

Em `src/pages/Home.tsx`, substituir a `<section>` do hero por:
```tsx
      <section className="relative overflow-hidden rounded-2xl border border-border/15 bg-card bg-hero-glow p-8 shadow-soft-lg md:p-12">
        <Guilloche className="opacity-[0.05]" />
        <div className="relative">
          <Badge variant="default" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            {t('home.badge')}
          </Badge>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/simulador">
                {t('home.hero.ctaPrimary')}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/comparar">{t('home.hero.ctaSecondary')}</Link>
            </Button>
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Importar Guilloche e ajustar títulos de seção**

Adicionar no topo de `src/pages/Home.tsx`:
```tsx
import { Guilloche } from '@/components/shared/Guilloche'
```
Nos `<h2>`/`<h3>` das seções (features e tipos), trocar `font-semibold` por `font-display text-2xl font-semibold` no `h2` de seção; nos `h3` de card manter `font-semibold` (corpo). Trocar `bg-background/60` dos chips por `bg-secondary` para coerência.

- [ ] **Step 3: Ícone das features em dourado translúcido**

No card de features, o `<span>` do ícone (`bg-primary/10 text-primary`) — manter, já está coerente. Sem mudança.

- [ ] **Step 4: Verificar**

Run: `npm run build`. No dev (Home): hero com glow dourado + textura gravada + manchete grande em Fraunces; seções com títulos display.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "Redesenha hero da Home com glow dourado, guilloche e titulo display"
```

---

## Task 11: Páginas restantes e shared (Simulator, Comparison, History, PageHeader, EmptyState)

**Files:**
- Modify: `src/components/shared/PageHeader.tsx`
- Modify: `src/components/shared/EmptyState.tsx`
- Modify: `src/pages/Simulator.tsx`
- Modify: `src/pages/Comparison.tsx`
- Modify: `src/pages/History.tsx`

- [ ] **Step 1: PageHeader em tipografia display**

Em `src/components/shared/PageHeader.tsx`, no título principal trocar a classe por `font-display text-3xl font-semibold tracking-tight text-foreground` e a descrição/subtítulo para `mt-2 text-muted-foreground`. Manter estrutura/props.

- [ ] **Step 2: EmptyState premium**

Em `src/components/shared/EmptyState.tsx`, o ícone num círculo `bg-primary/10 text-primary`, título em `font-display text-lg font-semibold`, texto em `text-muted-foreground`. Manter props e CTA.

- [ ] **Step 3: Conferir páginas e remover cores/estilos legados**

Em `src/pages/Simulator.tsx`, `Comparison.tsx`, `History.tsx`: garantir que usam `PageHeader`, `Card` e componentes já reskinados. Trocar quaisquer `bg-background/60`, `border-border` cheio ou hex remanescentes por `bg-secondary` / `border-border/15` / tokens. Títulos de seção dentro das páginas → `font-display`. Não alterar lógica (stores, handlers, cálculos).

- [ ] **Step 4: Verificar**

Run: `npm run build` e navegar as 4 rotas (`/`, `/simulador`, `/comparar`, `/historico`) nos dois temas. Tudo coerente, sem sobra de azul/amarelo neon.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/PageHeader.tsx src/components/shared/EmptyState.tsx src/pages/Simulator.tsx src/pages/Comparison.tsx src/pages/History.tsx
git commit -m "Aplica sistema visual Cofre nas paginas e componentes compartilhados"
```

---

## Task 12: Favicon coerente

**Files:**
- Modify: `public/favicon.svg`
- Modify: `index.html` (theme-color)

- [ ] **Step 1: Redesenhar o favicon**

Substituir todo o conteúdo de `public/favicon.svg` por:
```svg
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E8C77A" />
      <stop offset="0.55" stop-color="#C9A24B" />
      <stop offset="1" stop-color="#A8842F" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0B0C0E" />
  <rect x="13" y="36" width="8" height="15" rx="2" fill="url(#gold)" opacity="0.4" />
  <rect x="28" y="29" width="8" height="22" rx="2" fill="url(#gold)" opacity="0.7" />
  <rect x="43" y="19" width="8" height="32" rx="2" fill="url(#gold)" />
  <path d="M14 31L28 23L38 27L51 14" stroke="url(#gold)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M43 13H51V21" stroke="url(#gold)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

- [ ] **Step 2: Adicionar theme-color no HTML**

Em `index.html`, dentro do `<head>`, após a meta `description`, adicionar:
```html
    <meta name="theme-color" content="#0B0C0E" />
```

- [ ] **Step 3: Verificar**

Run: `npm run build`. Abrir o dev e conferir o favicon na aba (barras douradas em gradiente sobre obsidiana, combinando com a marca do Header).

- [ ] **Step 4: Commit**

```bash
git add public/favicon.svg index.html
git commit -m "Redesenha favicon com ouro champanhe coerente com a marca"
```

---

## Task 13: Varredura final e verificação completa

**Files:** nenhum novo; correções pontuais se necessário.

- [ ] **Step 1: Caçar cores banidas**

Buscar no `src/` e `public/` por: `#FFD700`, `#818CF8`, `#34D399`, `#0A0E27` e por `#` hex genéricos remanescentes em componentes de UI. Substituir qualquer ocorrência por token/`type.color`. (Cores em `src/constants/investments.ts` que representam os tipos de investimento são dados de domínio — manter, a menos que destoem; conferir se combinam com a paleta e ajustar tons se ficarem berrantes.)

- [ ] **Step 2: Build + lint + testes**

Run:
```bash
npm run build && npm run lint && npm test
```
Expected: build OK, lint sem novos erros, todos os testes vitest passando.

- [ ] **Step 3: Conferência visual final**

Run: `npm run dev`. Percorrer `/`, `/simulador` (simular um valor), `/comparar`, `/historico`, alternando dark/light e PT/EN. Conferir: Fraunces em títulos/números, Geist no corpo, ouro champanhe, esmeralda nos ganhos, terracota no imposto, guilloché no hero e no saldo, favicon novo. Sem texto ilegível (contraste AA).

- [ ] **Step 4: Commit final (se houve ajustes)**

```bash
git add -A
git commit -m "Ajustes finais do overhaul visual e remocao de cores legadas"
```

---

## Self-review (cobertura do spec)

- Paleta dark+light → Task 2. ✓
- Ouro champanhe (sem `#FFD700`) → Tasks 2, 4, 9, 13. ✓
- Esmeralda/terracota → Tasks 2, 9. ✓
- Fraunces + Geist + tabular-nums → Tasks 1, 8, 9, 11. ✓
- Guilloché + glow + grão + sombras + raio → Tasks 2, 3, 8, 10. ✓
- Botão gradiente / cards / inputs / dialog / badge → Tasks 4, 5, 6. ✓
- Sidebar marca lateral / Header → Task 7. ✓
- ResultSummary herói → Task 8. ✓
- Gráficos e tabela → Task 9. ✓
- Páginas (Home, Simulator, Comparison, History) + shared → Tasks 10, 11. ✓
- Favicon → Task 12. ✓
- Critérios de sucesso (sem cores banidas, build/lint/test, AA, ambos temas) → Task 13. ✓

Convenções do projeto: código em inglês, textos via i18n (não tocados), rotas PT, commits em PT sem menção a IA. ✓

---
name: material-web
description: Guidelines, component catalog, token theming, and best practices for Google's Material Design 3 Web Components (@material/web). Use when creating, styling, or refactoring UI components with Material Design 3 (M3), Google design language, accessible form controls, dynamic color tokens, dialogs, or framework-agnostic web components.
---

# Material Web (@material/web) — Material Design 3

Guide for implementing and styling Google's official **Material Design 3 (M3)** Web Components built on Lit.

## 1. Installation & Setup

### A. Modern Build Tool (React, Vite, Next.js, Vue, Svelte)
```bash
npm install @material/web
```

Include Google's Material Symbols font in `index.html` or `<head>` for icon support:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
```

### B. Zero-Build / CDN (Static HTML, Prototyping)
```html
<script type="module">
  import 'https://esm.run/@material/web/all.js';
</script>
```

Or import specific components individually to optimize bundle size:
```html
<script type="module">
  import 'https://esm.run/@material/web/button/filled-button.js';
  import 'https://esm.run/@material/web/textfield/outlined-text-field.js';
</script>
```

---

## 2. Component Catalog & Code Patterns

### Buttons (`@material/web/button/*`)
```html
<!-- Filled (High emphasis) -->
<md-filled-button>Primary Action</md-filled-button>

<!-- Outlined (Medium emphasis) -->
<md-outlined-button>Secondary</md-outlined-button>

<!-- Text (Low emphasis) -->
<md-text-button>Cancel</md-text-button>

<!-- Elevated -->
<md-elevated-button>Elevated</md-elevated-button>

<!-- Tonal -->
<md-filled-tonal-button>Tonal Action</md-filled-tonal-button>

<!-- Button with Icon -->
<md-filled-button>
  <md-icon slot="icon">send</md-icon>
  Enviar
</md-filled-button>
```

### Text Fields (`@material/web/textfield/*`)
```html
<!-- Outlined Text Field -->
<md-outlined-text-field
  label="Email"
  type="email"
  supporting-text="Ex: contato@exemplo.com"
  required>
  <md-icon slot="leading-icon">mail</md-icon>
</md-outlined-text-field>

<!-- Filled Text Field -->
<md-filled-text-field
  label="Senha"
  type="password">
  <md-icon slot="leading-icon">lock</md-icon>
</md-filled-text-field>
```

### Selection Controls
```html
<!-- Checkbox -->
<label style="display: flex; align-items: center; gap: 8px;">
  <md-checkbox checked touch-target="wrapper"></md-checkbox>
  <span>Lembrar minhas preferências</span>
</label>

<!-- Switch -->
<label style="display: flex; align-items: center; gap: 8px;">
  <md-switch selected icons show-only-selected-icon></md-switch>
  <span>Modo Escuro</span>
</label>

<!-- Radio -->
<md-radio name="option" value="1" checked></md-radio>
<md-radio name="option" value="2"></md-radio>
```

### Dialogs / Modais (`@material/web/dialog/dialog.js`)
```html
<md-dialog id="confirm-dialog">
  <div slot="headline">Confirmar Ação</div>
  <form slot="content" id="dialog-form" method="dialog">
    Tem certeza de que deseja prosseguir com esta operação?
  </form>
  <div slot="actions">
    <md-text-button form="dialog-form" value="cancel">Cancelar</md-text-button>
    <md-filled-button form="dialog-form" value="confirm">Confirmar</md-filled-button>
  </div>
</md-dialog>

<script>
  const dialog = document.querySelector('#confirm-dialog');
  // Para abrir:
  dialog.show();
  // Para fechar:
  dialog.close();
</script>
```

### Chips, Menus & Tabs
```html
<!-- Filter Chips -->
<md-chip-set>
  <md-filter-chip label="Todos" selected></md-filter-chip>
  <md-filter-chip label="Novidades"></md-filter-chip>
  <md-filter-chip label="Mais Vendidos"></md-filter-chip>
</md-chip-set>

<!-- Tabs -->
<md-tabs active-tab-index="0">
  <md-primary-tab>
    <md-icon slot="icon">home</md-icon>
    Início
  </md-primary-tab>
  <md-primary-tab>
    <md-icon slot="icon">shopping_bag</md-icon>
    Produtos
  </md-primary-tab>
</md-tabs>
```

---

## 3. Theming & Material You Dynamic Color Tokens

Material Web uses CSS Custom Properties (CSS variables) for all design tokens. Override them at `:root` or on component wrappers.

### Standard M3 Color System
```css
:root {
  /* Fontes base */
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Cores Principais (Primary, Secondary, Tertiary, Surface, Error) */
  --md-sys-color-primary: #8b0000;              /* Cor de destaque */
  --md-sys-color-on-primary: #ffffff;           /* Texto sobre cor primária */
  --md-sys-color-primary-container: #ffdad6;    /* Recipiente primário */
  --md-sys-color-on-primary-container: #410002; /* Texto sobre o recipiente */

  --md-sys-color-surface: #fffbff;              /* Fundo de cartões/telas */
  --md-sys-color-on-surface: #201a1a;           /* Texto padrão sobre a superfície */
  --md-sys-color-surface-variant: #f5ddda;      /* Superfícies secundárias */
  --md-sys-color-on-surface-variant: #534341;   /* Rótulos e textos secundários */

  --md-sys-color-outline: #857371;              /* Bordas e linhas */
  --md-sys-color-outline-variant: #d8c2bf;
}
```

### Component-Specific Overrides
Every component exposes fine-grained CSS tokens:
```css
/* Customizar borda e raio do botão */
md-filled-button {
  --md-filled-button-container-shape: 12px;
  --md-filled-button-container-color: #e53935;
  --md-filled-button-label-text-color: #ffffff;
}

/* Customizar input text field */
md-outlined-text-field {
  --md-outlined-text-field-container-shape: 8px;
  --md-outlined-text-field-outline-color: #b0bec5;
  --md-outlined-text-field-focus-outline-color: #e53935;
}
```

---

## 4. Integration with React & Next.js

When using Material Web in React/JSX:
1. Import components at the top level or module entry.
2. Web components receive boolean attributes via presence or standard properties.
3. Event listeners: Standard events (e.g. `onChange`, `onClick`) or `addEventListener` for custom M3 events (`input`, `change`, `closed`, `opening`).

```tsx
'use client';

import { useEffect, useRef } from 'react';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

export function ContactForm() {
  const inputRef = useRef<MdOutlinedTextField>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <md-outlined-text-field
        ref={inputRef}
        label="Seu Email"
        type="email"
        required
      />
      <md-filled-button onClick={() => console.log(inputRef.current?.value)}>
        Cadastrar
      </md-filled-button>
    </div>
  );
}
```

---

## 5. Rules & Quality Standards

1. **Always use slots correctly:** Place icons in `slot="icon"` (buttons/tabs) or `slot="leading-icon"` / `slot="trailing-icon"` (text fields).
2. **Never hide focus rings:** Material Web has accessible focus rings (`md-focus-ring`) built-in. Do not disable them.
3. **Respect M3 Hierarchy:** Use `md-filled-button` for the primary screen action, `md-filled-tonal-button` for secondary grouped actions, and `md-text-button` for modal dismissals/cancelations.
4. **Touch targets:** Keep `touch-target="wrapper"` enabled on compact controls (checkbox, switch, radio) to ensure 48x48px touch accessibility on mobile devices.

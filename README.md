# React Components

A personal collection of reusable React UI components that can be copied into future projects.

This repository is set up as a playground where each component is built, previewed, and refined before reuse.

## Current Component Library

- `AccordionCards` - an interactive expanding card accordion with smooth transitions and icon overlays.

Main component source:

- `example-app/src/components/AccordionCards.tsx`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

## Project Structure

```text
react components/
  .vscode/
  example-app/
    src/
      components/
        AccordionCards.tsx
      App.tsx
```

## Run Locally

From `example-app`:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal (usually `http://localhost:5173`).

## Build Check

From `example-app`:

```bash
npm run build
```

This runs TypeScript checks and creates a production build.

## Reuse a Component in Another Project

1. Copy the component file from `example-app/src/components/`.
2. Paste it into your target project (for example `src/components/`).
3. Ensure dependencies exist in the target project:
   - `react`
   - `tailwindcss` (if using the same Tailwind classes)
4. Import and render it:

```tsx
import AccordionCards from "./components/AccordionCards";

export default function App() {
  return <AccordionCards />;
}
```

## Notes

- Components are currently self-contained and can be used without extra utility files.
- As this library grows, consider adding one folder per component plus usage docs and variants.

## Roadmap

- Add more standalone components (cards, navbars, hero sections, pricing blocks).
- Create a component index/gallery page in `example-app`.
- Add props-driven customization for easier reuse across projects.

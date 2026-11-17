# Interactive Image Accordion

The live website remains static HTML/CSS/JavaScript. The accordion is integrated in `public/index.html`, styled in `public/styles.css`, and synchronized with service details by `selectService()` in `public/app.js`. It uses the four existing brochure images, desktop hover, native buttons, keyboard arrow navigation, mobile tap, and reduced-motion support. No dependencies were added to the live site.

`ui/interactive-image-accordion.tsx` is the reusable, typed React version adapted from the supplied component. `ui/demo.tsx` demonstrates it. Neither is loaded by the static site. The TSX source was not compiled as part of the static build.

## Optional React setup

To use the React component in a separate application, follow the official [shadcn Vite installation guide](https://ui.shadcn.com/docs/installation/vite). Do not run the scaffolding command inside this existing site.

```sh
npm create vite@latest techno-fab-react -- --template react-ts
cd techno-fab-react
npm install
npm install tailwindcss @tailwindcss/vite
```

Add `tailwindcss()` from `@tailwindcss/vite` to the Vite `plugins` array alongside `react()`. Add `@import "tailwindcss";` to the application's main stylesheet. Configure the TypeScript and Vite `@` alias to point at `src` as described in the guide, then run:

```sh
npx shadcn@latest init
```

Copy `ui/interactive-image-accordion.tsx` to `src/components/ui/interactive-image-accordion.tsx`, and the service WebP files from this site's `public/assets` into the new application's `public/assets`. Import with:

```tsx
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
```

`components/ui` is the shadcn convention for reusable primitives; it keeps imports and generated component locations consistent. The current site's stylesheet remains `public/styles.css`. No context providers, icon libraries, or state-management packages are required by this component; React's `useState` and `useRef` are sufficient.

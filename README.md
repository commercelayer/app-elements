# Core App Elements

## How to use it in your application

1. Install the package as dependency

```sh
pnpm install @commercelayer/core-app-elements
```

2. Add global css in your app index.tsx

```jsx
import "@commercelayer/core-app-elements/style.css";


React.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

3. Import any components your need

```jsx
import { Container, Button, Label } from "@commercelayer/core-app-elements";
```

## How to work with this locally with pnpm link

1. Build the library in watch mode `pnpm build --watch`
2. Install the library as symbolic link in your project

```sh
pnpm add link:~/path/to/commercelayer-core-app-elements/packages/core-app-elements/
```

3. Proceed with steps 2 and 3 as described in previous section.

## Storybook

To access documentation and examples you can run storybook locally

```sh
pnpm install

pnpm build

pnpm storybook
```

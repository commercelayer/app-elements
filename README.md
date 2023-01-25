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

3. load Manrope Google font into your html

```html
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</head>
```

4. Import any components your need

```jsx
import { Container, Button, Label } from "@commercelayer/core-app-elements";
```

5. (optional) install `@commercelayer/sdk` to use `<TokenProvider>` component

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

## Preact

Support for `preact` is provided out of the box, thanks to the fact we are not including React jsx-runtime modules in bundled files.
The application where this package is installed to is responsible of this.
But no extra configuration should be required in your project, in fact all latest versions of vite, react and preact will handle this automatically.

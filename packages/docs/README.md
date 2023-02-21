# App Elements

React UI Elements for Commerce Layer applications.

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a multi-market commerce API and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, wearable, voice, or IoT device, with ease. Compose your stack with the best-of-breed tools you already mastered and love. Make any experience shoppable, anywhere, through a blazing-fast, enterprise-grade, and secure API.

## Table of contents

- [Getting started](#getting-started)
- [Preact](#preact)

## Getting started

1. Install the package as dependency

```sh
pnpm install @commercelayer/app-elements
```

2. Add global css in your app index.tsx

```jsx
import "@commercelayer/app-elements/style.css";


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
import { Container, Button, Label } from "@commercelayer/app-elements";
```

5. (optional) install `@commercelayer/sdk` to use `<TokenProvider>` component

## Preact

Support for `preact` is provided out of the box, thanks to the fact we are not including React jsx-runtime modules in bundled files.
The application where this package is installed to is responsible of this.
But no extra configuration should be required in your project, in fact all latest versions of vite, react and preact will handle this automatically.

> [!WARNING]
> This library is still in active development.

# App Elements

`App Elements` is a React components library used to build Commerce Layer dashboard HUB apps. This library contains different types of components, helpers and hooks, from simple and small bits like `Button` o `Card` to complex components like `OrderSummary`.

## Local development

```sh
pnpm install
pnpm dev
```

### Link to other application

```sh
pnpm build:elements --watch

cd ~/projects/app-elements/packages/app-elements
pnpm link --global

cd ~/projects/my-app/packages/app
pnpm link --global @commercelayer/app-elements
```

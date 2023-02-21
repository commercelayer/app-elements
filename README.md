# App Elements

React UI Elements for Commerce Layer applications.

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

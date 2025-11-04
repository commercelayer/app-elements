# Rule Engine

## Generate types

Here below you can find commands to regenerate all types from the JSON Schema:

```sh
curl -s https://core.commercelayer.io/api/public/schemas/order_rules | pnpx json-schema-to-typescript > ./packages/app-elements/src/ui/forms/RuleEngine/schema.order_rules.ts

curl -s https://core.commercelayer.io/api/public/schemas/price_rules | pnpx json-schema-to-typescript > ./packages/app-elements/src/ui/forms/RuleEngine/schema.price_rules.ts
```

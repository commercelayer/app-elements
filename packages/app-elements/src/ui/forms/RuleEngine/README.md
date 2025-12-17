# Rule Engine

## Generate types

Here below you can find commands to regenerate all types from the JSON Schema using [json2ts](https://github.com/bcherny/json-schema-to-typescript):

```sh
# Download new JSON schemas

curl -s https://core.commercelayer.io/api/public/schemas/order_rules -o ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/order_rules.json

curl -s https://core.commercelayer.io/api/public/schemas/price_rules -o ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/price_rules.json

curl -s https://provisioning.commercelayer.io/api/public/schemas/organization_config -o ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/organization_config.json
```

```sh
# Convert JSON schemas to typescript types

pnpx json-schema-to-typescript --no-style.semi ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/order_rules.json ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/order_rules.schema.ts

pnpx json-schema-to-typescript --no-style.semi ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/price_rules.json ./packages/app-elements/src/ui/forms/RuleEngine/json_schema/price_rules.schema.ts
```

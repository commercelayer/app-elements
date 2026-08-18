import { HttpResponse, http } from "msw"

import orderRulesJsonSchema from "#ui/forms/RuleEngine/json_schema/order_rules.json"
import priceRulesJsonSchema from "#ui/forms/RuleEngine/json_schema/price_rules.json"

const orderRulesSchema = http.get(
  `https://core.commercelayer.*/api/public/schemas/order_rules`,
  async () => HttpResponse.json(orderRulesJsonSchema),
)

const priceRulesSchema = http.get(
  `https://core.commercelayer.*/api/public/schemas/price_rules`,
  async () => HttpResponse.json(priceRulesJsonSchema),
)

export default [orderRulesSchema, priceRulesSchema]

import { asUniqueArray } from "#utils/array"
import orderRulesJsonSchema from "./json_schema/order_rules.json" with {
  type: "json",
}
import type { RulesForOrderContext } from "./json_schema/order_rules.schema"
import organizationConfigJsonSchema from "./json_schema/organization_config.json" with {
  type: "json",
}
import priceRulesJsonSchema from "./json_schema/price_rules.json" with {
  type: "json",
}

export type RulesObject = RulesForOrderContext
type Rule = NonNullable<RulesObject["rules"]>[number]
export type SchemaCondition = NonNullable<Rule["conditions"][number]["nested"]>
export type SchemaActionItem = NonNullable<Rule["actions"]>[number]
export type SchemaConditionItem = NonNullable<
  SchemaCondition["conditions"]
>[number]
export type ActionType = Rule["actions"][number]["type"]

export interface SetPath {
  (path: string): SetPath
  (path: string, pathValue: unknown, shouldForceUpdate?: boolean): RulesObject
}

export type ConditionMatchersWithoutValue = Exclude<
  SchemaConditionItem,
  { value: any }
>["matcher"]

export const conditionMatchersWithoutValue = asUniqueArray([
  "blank",
  "present",
  "null",
  "not_null",
]) satisfies ConditionMatchersWithoutValue[]

export type ItemWithValue = Exclude<
  SchemaConditionItem,
  { matcher: ConditionMatchersWithoutValue }
>

export type JSONSchema =
  | "none"
  | "order-rules"
  | "price-rules"
  | "organization-config"

export async function fetchJsonSchema<J extends JSONSchema>(
  jsonSchema: J,
  domain: string,
): Promise<
  J extends "organization-config"
    ? typeof organizationConfigJsonSchema
    : J extends "order-rules"
      ? typeof orderRulesJsonSchema
      : J extends "price-rules"
        ? typeof priceRulesJsonSchema
        : void
> {
  if (domain === "localhost") {
    domain = "commercelayer.io"
  }

  switch (jsonSchema) {
    case "none": {
      break
    }

    case "organization-config": {
      return (
        await fetch(
          `https://provisioning.${domain}/api/public/schemas/organization_config`,
        )
      ).json()
    }

    case "order-rules": {
      return (
        await fetch(`https://core.${domain}/api/public/schemas/order_rules`)
      ).json()
    }

    case "price-rules": {
      return (
        await fetch(`https://core.${domain}/api/public/schemas/price_rules`)
      ).json()
    }
  }

  return undefined as any
}

/**
 * This function is used to ensure that a value of type `never` is never reached.
 * @param _value - The value that is expected to be of type `never`.
 */
export function expectNever(_value: never): null {
  return null
}

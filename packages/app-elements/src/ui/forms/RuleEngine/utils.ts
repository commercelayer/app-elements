import type { JsonValue } from "type-fest"
import { asUniqueArray } from "#utils/array"
import type { RulesForOrderContext } from "./schema.order_rules"

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

export const fetchJsonSchema = async (
  jsonSchema: JSONSchema,
  domain: string,
): Promise<JsonValue | undefined> => {
  switch (jsonSchema) {
    case "none": {
      break
    }

    case "organization-config": {
      return fetch(
        `https://provisioning.${domain}/api/public/schemas/organization_config`,
      ).then<JsonValue>(async (res) => await res.json())
    }

    case "order-rules": {
      return fetch(
        `https://core.${domain}/api/public/schemas/order_rules`,
      ).then<JsonValue>(async (res) => await res.json())
    }

    case "price-rules": {
      return fetch(
        `https://core.${domain}/api/public/schemas/price_rules`,
      ).then<JsonValue>(async (res) => await res.json())
    }
  }
}

/**
 * This function is used to ensure that a value of type `never` is never reached.
 * @param _value - The value that is expected to be of type `never`.
 */
export function expectNever(_value: never): null {
  return null
}

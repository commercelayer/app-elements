import type { JsonValue } from "type-fest"
import type { RuleEngineProps } from "./RuleEngineComponent"
import type { ActionType, SchemaActionItem, SchemaConditionItem } from "./utils"

/**
 * Configuration for a single option including its availability and constraints
 */
export interface OptionConfig {
  /** Option property name */
  name: string
  /** Human-readable label */
  label: string
  /** Array of option names that cannot coexist with this option */
  mutuallyExclusiveWith: string[]
  /** Type of value this option accepts */
  valueType?: "boolean" | "string" | "number" | "integer" | "object" | "array"
  /** Description of what this option does */
  description?: string
  /** Predefined values from configuration */
  values?: Array<{ label: string; value: string; meta?: Record<string, any> }>
}

/**
 * Complete options configuration for the rule engine
 */
export interface OptionsConfig {
  /** Available options per action type and applyTo */
  actions: Record<
    ActionType,
    Record<OrderApplyTo | PriceApplyTo, OptionConfig[]>
  >
  /** Available options for conditions */
  conditions: OptionConfig[]
}

const configuration = {
  actions: {
    "order-rules": {
      order: {
        round: true,
        discount_mode: true,
        apply_on: [
          { label: "Subtotal amount", value: "subtotal_amount_cents" },
          { label: "Total amount", value: "total_amount_cents" },
        ],
        limit: [
          {
            label: "Most expensive",
            value: "most-expensive",
            meta: {
              attribute: "total_amount_cents",
              direction: "desc",
            },
          },
          {
            label: "Less expensive",
            value: "less-expensive",
            meta: {
              attribute: "total_amount_cents",
              direction: "asc",
            },
          },
        ],
      },
      "order.line_items": {
        round: true,
        discount_mode: true,
        apply_on: [
          { label: "Unit amount", value: "unit_amount_cents" },
          { label: "Compare at amount", value: "compare_at_amount_cents" },
        ],
        limit: [
          {
            label: "Most expensive",
            value: "most-expensive",
            meta: {
              attribute: "unit_amount_cents",
              direction: "desc",
            },
          },
          {
            label: "Less expensive",
            value: "less-expensive",
            meta: {
              attribute: "unit_amount_cents",
              direction: "asc",
            },
          },
        ],
        bundle: [
          {
            label: "Most expensive",
            value: "most-expensive",
            meta: {
              attribute: "unit_amount_cents",
              direction: "desc",
            },
          },
        ],
        aggregation: [
          {
            label: "Total quantity",
            value: "total_quantity",
            meta: { field: "order.line_items.quantity", operator: "sum" },
          },
        ],
      },
      "order.line_items.line_item_options": {},
      "order.line_items.sku": {},
      "order.line_items.bundle": {},
      "order.line_items.shipment": {},
      "order.line_items.payment_method": {
        limit: [
          {
            label: "Most expensive",
            value: "most-expensive",
            meta: {
              attribute: "price_amount_cents",
              direction: "desc",
            },
          },
          {
            label: "Less expensive",
            value: "less-expensive",
            meta: {
              attribute: "price_amount_cents",
              direction: "asc",
            },
          },
        ],
      },
      "order.line_items.adjustment": {},
      "order.line_items.gift_card": {},
    } as const,
    "price-rules": {
      price: {
        apply_on: [
          { label: "Amount", value: "amount_cents" },
          { label: "Original amount", value: "original_amount_cents" },
          { label: "Compare at amount", value: "compare_at_amount_cents" },
        ],
        round: true,
        // limit: true,
      },
    } as const,
  },
  conditions: {
    group: true,
    scope: true,
    aggregations: [
      {
        label: "Total quantity",
        value: "total_quantity",
        meta: { field: "order.line_items.quantity", operator: "sum" },
      },
    ],
  },
} satisfies {
  actions:
    | Record<
        Extract<RuleEngineProps["schemaType"], "order-rules">,
        Record<
          OrderApplyTo,
          {
            [key in ManagedActionOption]?: OptionValue
          }
        >
      >
    | Record<
        Extract<RuleEngineProps["schemaType"], "price-rules">,
        Record<
          PriceApplyTo,
          {
            [key in ManagedActionOption]?: OptionValue
          }
        >
      >
  conditions: {
    [key in ManagedConditionOption]?: OptionValue
  }
}

type OptionValue =
  | true
  | {
      label: string
      value: string
      meta?: unknown
    }[]

type OrderApplyTo =
  | "order.line_items.adjustment"
  | "order.line_items.gift_card"
  | "order.line_items.shipment"
  | "order.line_items.sku"
  | "order.line_items.bundle"
  | "order.line_items.payment_method"
  | "order.line_items.line_item_options"
  | "order.line_items"
  | "order"

type PriceApplyTo = "price"

/**
 * Options that we want to manage dynamically
 */
const MANAGED_ACTION_OPTIONS = [
  "apply_on",
  "round",
  "limit",
  "discount_mode",
  "aggregation",
  "bundle",
] as const

const MANAGED_CONDITION_OPTIONS = ["group", "scope", "aggregations"] as const

export type ManagedActionOption = (typeof MANAGED_ACTION_OPTIONS)[number]
export type ManagedConditionOption = (typeof MANAGED_CONDITION_OPTIONS)[number]

/**
 * Human-readable labels for options
 */
export const OPTION_LABELS: Record<
  ManagedActionOption | ManagedConditionOption,
  string
> = {
  apply_on: "Apply on",
  round: "Round",
  limit: "Limit",
  discount_mode: "Discount mode",
  aggregation: "Aggregation",
  bundle: "Bundle",
  scope: "Scope",
  aggregations: "Aggregations",
  group: "Group",
} as const

/**
 * Parse JSON schema to extract options configuration
 */
export function parseOptionsFromSchema(
  jsonSchema: JsonValue | undefined,
  schemaType: RuleEngineProps["schemaType"],
): OptionsConfig {
  if (jsonSchema == null || typeof jsonSchema !== "object") {
    return {
      actions: {} as Record<
        ActionType,
        Record<OrderApplyTo | PriceApplyTo, OptionConfig[]>
      >,
      conditions: [],
    }
  }

  const schema = jsonSchema as any

  return {
    actions: parseActionOptions(schema, schemaType),
    conditions: parseConditionOptions(schema),
  }
}

/**
 * Parse action options from JSON schema
 */
function parseActionOptions(
  schema: any,
  schemaType: RuleEngineProps["schemaType"],
): Record<ActionType, Record<OrderApplyTo | PriceApplyTo, OptionConfig[]>> {
  const actionsConfig = {} as Record<
    ActionType,
    Record<OrderApplyTo | PriceApplyTo, OptionConfig[]>
  >

  try {
    const actionVariants =
      schema?.properties?.rules?.items?.properties?.actions?.items?.anyOf ?? []

    const variantsByType = groupVariantsByType(actionVariants)

    for (const [actionType, variants] of variantsByType.entries()) {
      const optionsMap = buildOptionsMap(variants, MANAGED_ACTION_OPTIONS)
      const baseOptions = buildOptions(optionsMap, variants, schema)

      // Get applyTo keys from configuration
      const configForSchemaType = configuration.actions[schemaType]
      const applyToKeys = Object.keys(configForSchemaType) as (
        | OrderApplyTo
        | PriceApplyTo
      )[]

      actionsConfig[actionType] = {} as Record<
        OrderApplyTo | PriceApplyTo,
        OptionConfig[]
      >

      for (const applyTo of applyToKeys) {
        const configForApplyTo =
          configForSchemaType[applyTo as keyof typeof configForSchemaType]

        if (configForApplyTo == null) continue

        // Filter and enhance options based on configuration
        actionsConfig[actionType][applyTo] = baseOptions
          .filter((option) => {
            return (
              configForApplyTo[
                option.name as ManagedActionOption | ManagedConditionOption
              ] != null
            )
          })
          .map((option) => {
            const optionValue =
              configForApplyTo[
                option.name as ManagedActionOption | ManagedConditionOption
              ]
            return {
              ...option,
              // Configuration values override schema-derived values
              values: Array.isArray(optionValue) ? optionValue : option.values,
            }
          })
      }
    }
  } catch (error) {
    console.error("Error parsing action options from schema:", error)
  }

  return actionsConfig
}

/**
 * Parse condition options from JSON schema
 */
function parseConditionOptions(schema: any): OptionConfig[] {
  try {
    const conditionVariants = schema?.$defs?.conditions?.items?.anyOf ?? []
    const optionsMap = buildOptionsMap(
      conditionVariants,
      MANAGED_CONDITION_OPTIONS,
    )
    const baseOptions = buildOptions(optionsMap, conditionVariants, schema)

    // Filter and enhance options based on configuration
    return baseOptions
      .filter((option) => {
        const optionValue =
          configuration.conditions[option.name as ManagedConditionOption]
        // Include if explicitly set (true or array of values)
        return optionValue != null
      })
      .map((option) => {
        const optionValue =
          configuration.conditions[option.name as ManagedConditionOption]
        return {
          ...option,
          // Configuration values override schema-derived values
          values: Array.isArray(optionValue) ? optionValue : option.values,
        }
      })
  } catch (error) {
    console.error("Error parsing condition options from schema:", error)
    return []
  }
}

/**
 * Group action variants by their type
 */
function groupVariantsByType(actionVariants: any[]): Map<ActionType, any[]> {
  const variantsByType = new Map<ActionType, any[]>()

  for (const variant of actionVariants) {
    const actionType = variant?.properties?.type?.enum?.[0] as
      | ActionType
      | undefined
    if (actionType != null) {
      if (!variantsByType.has(actionType)) {
        variantsByType.set(actionType, [])
      }
      variantsByType.get(actionType)?.push(variant)
    }
  }

  return variantsByType
}

/**
 * Track which options appear in which variants
 */
function buildOptionsMap(
  variants: any[],
  managedOptions: readonly string[],
): Map<string, { appearsIn: Set<number>; requiredIn: Set<number> }> {
  const optionsMap = new Map<
    string,
    { appearsIn: Set<number>; requiredIn: Set<number> }
  >()

  variants.forEach((variant, index) => {
    const properties = Object.keys(variant.properties ?? {})
    const required = new Set(variant.required ?? [])

    for (const prop of properties) {
      if (managedOptions.includes(prop)) {
        if (!optionsMap.has(prop)) {
          optionsMap.set(prop, {
            appearsIn: new Set(),
            requiredIn: new Set(),
          })
        }
        optionsMap.get(prop)?.appearsIn.add(index)
        if (required.has(prop)) {
          optionsMap.get(prop)?.requiredIn.add(index)
        }
      }
    }
  })

  return optionsMap
}

/**
 * Build option configs from options map
 */
function buildOptions(
  optionsMap: Map<string, { appearsIn: Set<number>; requiredIn: Set<number> }>,
  variants: any[],
  schema: any,
): OptionConfig[] {
  const options: OptionConfig[] = []

  for (const [optionName, { appearsIn }] of optionsMap.entries()) {
    const mutuallyExclusiveWith = findMutuallyExclusiveOptions(
      optionName,
      appearsIn,
      optionsMap,
    )

    // Extract metadata from schema
    let metadata: ReturnType<typeof extractPropertyMetadata> = {}
    for (const variant of variants) {
      const propertySchema = variant.properties?.[optionName]
      metadata = extractPropertyMetadata(propertySchema, schema)
      if (
        metadata.values != null ||
        metadata.valueType != null ||
        metadata.description != null
      ) {
        break
      }
    }

    options.push({
      name: optionName,
      label:
        OPTION_LABELS[
          optionName as ManagedActionOption | ManagedConditionOption
        ],
      mutuallyExclusiveWith,
      ...metadata,
    })
  }

  return options
}

/**
 * Determine which options are mutually exclusive
 */
function findMutuallyExclusiveOptions(
  optionName: string,
  appearsIn: Set<number>,
  optionsMap: Map<string, { appearsIn: Set<number>; requiredIn: Set<number> }>,
): string[] {
  const mutuallyExclusiveWith: string[] = []

  for (const [otherOption, { appearsIn: otherAppearsIn }] of optionsMap) {
    if (otherOption === optionName) continue

    // If two options never appear in the same variant, they're mutually exclusive
    const intersection = new Set(
      [...appearsIn].filter((x) => otherAppearsIn.has(x)),
    )

    if (intersection.size === 0 && appearsIn.size > 0) {
      mutuallyExclusiveWith.push(otherOption)
    }
  }

  return mutuallyExclusiveWith
}

/**
 * Helper to extract enum values and type from a schema property, resolving $ref if needed
 */
function extractPropertyMetadata(
  propertySchema: any,
  schema: any,
): Pick<OptionConfig, "valueType" | "description" | "values"> {
  const metadata: Pick<OptionConfig, "valueType" | "description" | "values"> =
    {}

  let resolvedSchema = propertySchema

  // Resolve $ref if present
  if (propertySchema?.$ref != null && typeof propertySchema.$ref === "string") {
    const refPath = propertySchema.$ref.replace(/^#\//, "").split("/")
    let resolved: any = schema
    for (const key of refPath) {
      resolved = resolved?.[key]
    }
    resolvedSchema = resolved
  }

  if (resolvedSchema?.enum != null && Array.isArray(resolvedSchema.enum)) {
    metadata.values = resolvedSchema.enum.map((value: string) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1),
      value: value,
    }))
  }

  if (resolvedSchema?.type != null) {
    metadata.valueType = resolvedSchema.type
  }

  if (
    resolvedSchema?.description != null &&
    typeof resolvedSchema.description === "string"
  ) {
    metadata.description = resolvedSchema.description
  }

  return metadata
}

/**
 * Result of checking option availability
 */
interface OptionAvailability {
  /** Options that can be added */
  available: OptionConfig[]
  /** Options that are disabled due to conflicts */
  disabled: OptionConfig[]
  /** Options that are currently set */
  current: string[]
}

/**
 * Hook to determine which options are available for the current item
 */
export function useAvailableOptions(
  item: SchemaActionItem | SchemaConditionItem | null,
  optionsConfig: OptionConfig[],
): OptionAvailability {
  if (item == null) {
    return {
      available: [],
      disabled: [],
      current: [],
    }
  }

  // Get currently set options
  const currentOptions = optionsConfig
    .map((opt) => opt.name)
    .filter((name) => {
      const isPresent =
        name in item && item[name as keyof typeof item] !== undefined
      const isNonEmptyArray =
        Array.isArray(item[name as keyof typeof item]) &&
        (item[name as keyof typeof item] as any[]).length > 0

      return Array.isArray(item[name as keyof typeof item])
        ? isNonEmptyArray
        : isPresent
    })

  // Determine available and disabled options
  const available: OptionConfig[] = []
  const disabled: OptionConfig[] = []

  for (const option of optionsConfig) {
    // Skip if already set
    if (currentOptions.includes(option.name)) {
      continue
    }

    // Check if mutually exclusive with any current option
    const hasConflict = option.mutuallyExclusiveWith.some((exclusive) =>
      currentOptions.includes(exclusive),
    )

    if (hasConflict) {
      disabled.push(option)
    } else {
      available.push(option)
    }
  }

  return {
    available,
    disabled,
    current: currentOptions,
  }
}

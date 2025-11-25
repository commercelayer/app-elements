import type { JsonValue } from "type-fest"
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
  /** Possible enum values */
  enum?: string[]
  /** Description of what this option does */
  description?: string
}

/**
 * Complete options configuration for the rule engine
 */
export interface OptionsConfig {
  /** Available options per action type */
  actions: Record<ActionType, OptionConfig[]>
  /** Available options for conditions */
  conditions: OptionConfig[]
}

/**
 * Options that we want to manage dynamically
 */
const MANAGED_ACTION_OPTIONS = ["apply_on", "round", "discount_mode"] as const

const MANAGED_CONDITION_OPTIONS = ["scope"] as const

type ManagedActionOption = (typeof MANAGED_ACTION_OPTIONS)[number]
type ManagedConditionOption = (typeof MANAGED_CONDITION_OPTIONS)[number]

/**
 * Human-readable labels for options
 */
const OPTION_LABELS: Record<
  ManagedActionOption | ManagedConditionOption,
  string
> = {
  apply_on: "Apply on",
  round: "Round",
  discount_mode: "Discount mode",
  scope: "Scope",
} as const

/**
 * Parse JSON schema to extract options configuration
 */
export function parseOptionsFromSchema(
  jsonSchema: JsonValue | undefined,
): OptionsConfig {
  if (jsonSchema == null || typeof jsonSchema !== "object") {
    return {
      actions: {} as Record<ActionType, OptionConfig[]>,
      conditions: [],
    }
  }

  const schema = jsonSchema as any

  return {
    actions: parseActionOptions(schema),
    conditions: parseConditionOptions(schema),
  }
}

/**
 * Parse action options from JSON schema
 */
function parseActionOptions(schema: any): Record<ActionType, OptionConfig[]> {
  const actionsConfig: Record<ActionType, OptionConfig[]> = {} as Record<
    ActionType,
    OptionConfig[]
  >

  try {
    const actionVariants =
      schema?.properties?.rules?.items?.properties?.actions?.items?.anyOf ?? []

    const variantsByType = groupVariantsByType(actionVariants)

    for (const [actionType, variants] of variantsByType.entries()) {
      const optionsMap = buildOptionsMap(variants, MANAGED_ACTION_OPTIONS)
      actionsConfig[actionType] = buildOptions(optionsMap, variants, schema)
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
    return buildOptions(optionsMap, conditionVariants, schema)
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

    // Extract enum values and type from schema
    let metadata: ReturnType<typeof extractPropertyMetadata> = {}
    for (const variant of variants) {
      const propertySchema = variant.properties?.[optionName]
      metadata = extractPropertyMetadata(propertySchema, schema)
      if (
        metadata.enum != null ||
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
): Pick<OptionConfig, "enum" | "valueType" | "description"> {
  const metadata: Pick<OptionConfig, "enum" | "valueType" | "description"> = {}

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
    metadata.enum = resolvedSchema.enum
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
    .filter((name) => name in item && item[name as keyof typeof item] != null)

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

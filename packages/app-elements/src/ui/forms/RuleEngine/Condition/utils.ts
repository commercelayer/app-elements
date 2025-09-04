import { isValid, parseJSON } from "date-fns"
import type { atPath } from "#ui/forms/CodeEditor/fetchCoreResourcesSuggestions"
import type { ItemWithValue, SchemaConditionItem } from "../utils"

type MatcherDictionary = Array<{
  matcher: SchemaConditionItem["matcher"]
  visible?: boolean
  label: string
  fieldTypes: Array<
    NonNullable<Awaited<ReturnType<typeof atPath>>["field"]>["type"]
  >
  isMulti: boolean
  exactMatch: boolean
}>

export const matcherDictionary: MatcherDictionary = [
  {
    /** Matches if field value equals provided value
     * @field Integer, String, Datetime, Boolean
     * @value Integer, String, Datetime, Boolean
     */
    matcher: "eq",
    label: "equals",
    fieldTypes: ["integer", "string", "datetime", "boolean"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is not equal to provided value
     * @field Integer, String, Datetime, Boolean
     * @value Integer, String, Datetime, Boolean
     */
    matcher: "not_eq",
    label: "not equals",
    fieldTypes: ["integer", "string", "datetime", "boolean"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is less than provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: "lt",
    label: "<",
    fieldTypes: ["integer", "datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is less than or equal to provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: "lteq",
    label: "≤",
    fieldTypes: ["integer", "datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is greater than provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: "gt",
    label: ">",
    fieldTypes: ["integer", "datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is greater than or equal to provided value
     * @field Integer, Datetime
     * @value Integer, Datetime
     */
    matcher: "gteq",
    label: "≥",
    fieldTypes: ["integer", "datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is a multiple of provided value
     * @field Integer
     * @value Integer
     */
    matcher: "multiple",
    label: "is a multiple of",
    fieldTypes: ["integer"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value matches regex pattern
     * @field String
     * @value String
     */
    matcher: "matches",
    label: "matches regex",
    fieldTypes: ["string"],
    isMulti: false,
    exactMatch: false,
  },
  {
    /** Matches if field value does not match regex pattern
     * @field String
     * @value String
     */
    matcher: "does_not_match",
    label: "doesn't match regex",
    fieldTypes: ["string"],
    isMulti: false,
    exactMatch: false,
  },
  {
    /** Matches if field value starts with provided string
     * @field String
     * @value String
     */
    matcher: "start_with",
    label: "starts with",
    fieldTypes: ["string"],
    isMulti: false,
    exactMatch: false,
  },
  {
    /** Matches if field value does not start with provided string
     * @field String
     * @value String
     */
    matcher: "not_start_with",
    label: "doesn't start with",
    fieldTypes: ["string"],
    isMulti: false,
    exactMatch: false,
  },
  {
    /** Matches if field value ends with provided string
     * @field String
     * @value String
     */
    matcher: "end_with",
    label: "ends with",
    fieldTypes: ["string"],
    isMulti: false,
    exactMatch: false,
  },
  {
    /** Matches if field value does not end with provided string
     * @field String
     * @value String
     */
    matcher: "not_end_with",
    label: "doesn't end with",
    fieldTypes: ["string"],
    isMulti: false,
    exactMatch: false,
  },
  {
    /** Matches if field value is between two values (exclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gt_lt",
    label: "> and <",
    fieldTypes: ["integer"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is between two values (inclusive start, exclusive end)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gteq_lt",
    label: "≥ and <",
    fieldTypes: ["integer"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is greater than first and less than or equal to second
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gt_lteq",
    label: "> and ≤",
    fieldTypes: ["integer"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is between two values (inclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gteq_lteq",
    label: "≥ and ≤",
    fieldTypes: ["integer"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is between two values (exclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gt_lt",
    label: "date range",
    visible: false,
    fieldTypes: ["datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is between two values (inclusive start, exclusive end)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gteq_lt",
    label: "date range",
    visible: false,
    fieldTypes: ["datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is greater than first and less than or equal to second
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gt_lteq",
    label: "date range",
    visible: false,
    fieldTypes: ["datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is between two values (inclusive)
     * @field Integer, Datetime
     * @value Array
     */
    matcher: "gteq_lteq",
    label: "date range",
    visible: true,
    fieldTypes: ["datetime"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is in provided array
     * @field Integer, String, Datetime
     * @value Array
     */
    matcher: "is_in",
    label: "is one of",
    fieldTypes: ["integer", "string", "datetime"],
    isMulti: true,
    exactMatch: true,
  },
  {
    /** Matches if field value is not in provided array
     * @field Integer, String, Datetime
     * @value Array
     */
    matcher: "is_not_in",
    label: "is not one of",
    fieldTypes: ["integer", "string", "datetime"],
    isMulti: true,
    exactMatch: true,
  },
  {
    /** Matches objects within arrays that meet specified requirements
     * @field Array
     * @value Object
     */
    matcher: "array_match",
    label: "is",
    fieldTypes: ["integer", "string", "datetime"],
    isMulti: true,
    exactMatch: true,
  },
  {
    /** Matches if field value is null or empty string */
    matcher: "blank",
    label: "is blank",
    fieldTypes: ["integer", "string", "datetime", "boolean"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is null */
    matcher: "null",
    label: "is null",
    fieldTypes: ["integer", "string", "datetime", "boolean"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is not null */
    matcher: "not_null",
    label: "is not null",
    fieldTypes: ["integer", "string", "datetime", "boolean"],
    isMulti: false,
    exactMatch: true,
  },
  {
    /** Matches if field value is not null */
    matcher: "present",
    label: "is present",
    fieldTypes: ["integer", "string", "datetime", "boolean"],
    isMulti: false,
    exactMatch: true,
  },
]

export function guessFieldType(
  value: ItemWithValue["value"] | undefined,
): NonNullable<Awaited<ReturnType<typeof atPath>>["field"]>["type"] {
  if (typeof value === "string") {
    if (isValid(parseJSON(value))) {
      return "datetime"
    } else {
      return "string"
    }
  }

  if (typeof value === "number") {
    return "integer"
  }

  if (typeof value === "boolean") {
    return "boolean"
  }

  if (Array.isArray(value)) {
    if (typeof value[0] === "string") {
      if (isValid(parseJSON(value[0]))) {
        return "datetime"
      } else {
        return "string"
      }
    }

    if (typeof value[0] === "number") {
      return "integer"
    }
  }

  return "string" // default fallback
}

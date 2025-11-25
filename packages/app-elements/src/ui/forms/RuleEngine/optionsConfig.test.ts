import { describe, expect, it } from "vitest"
import orderRulesSchema from "./json_schema/order_rules.json"
import priceRulesSchema from "./json_schema/price_rules.json"
import { parseOptionsFromSchema, useAvailableOptions } from "./optionsConfig"

describe("parseOptionsFromSchema", () => {
  it("should parse order rules schema and extract action options with mutual exclusivity", () => {
    const config = parseOptionsFromSchema(orderRulesSchema as any)

    expect(config).toMatchInlineSnapshot(`
      {
        "actions": {
          "buy_x_pay_y": [],
          "every_x_discount_y": [],
          "fixed_amount": [
            {
              "description": "If provided, applies the action to a specific attribute instead of the default one.",
              "label": "Apply on",
              "mutuallyExclusiveWith": [],
              "name": "apply_on",
              "valueType": "string",
            },
            {
              "description": "The type of distribution of the discount over the items.",
              "enum": [
                "distributed",
                "default",
              ],
              "label": "Discount mode",
              "mutuallyExclusiveWith": [],
              "name": "discount_mode",
              "valueType": "string",
            },
          ],
          "fixed_price": [
            {
              "description": "If provided, applies the action to a specific attribute instead of the default one.",
              "label": "Apply on",
              "mutuallyExclusiveWith": [],
              "name": "apply_on",
              "valueType": "string",
            },
          ],
          "percentage": [
            {
              "description": "If true, rounds the discount, only available on percentage actions.",
              "label": "Round",
              "mutuallyExclusiveWith": [],
              "name": "round",
              "valueType": "boolean",
            },
            {
              "description": "If provided, applies the action to a specific attribute instead of the default one.",
              "label": "Apply on",
              "mutuallyExclusiveWith": [],
              "name": "apply_on",
              "valueType": "string",
            },
          ],
        },
        "conditions": [
          {
            "description": "Policy to determine if a condition is a match. If value is any (default), it will match as long as one fact it's a match, if value is all, it will match if all facts are a match.",
            "enum": [
              "any",
              "all",
            ],
            "label": "Scope",
            "mutuallyExclusiveWith": [],
            "name": "scope",
            "valueType": "string",
          },
        ],
      }
    `)
  })

  it("should parse price rules schema and extract action options with mutual exclusivity", () => {
    const config = parseOptionsFromSchema(priceRulesSchema as any)

    expect(config).toMatchInlineSnapshot(`
      {
        "actions": {
          "fixed_amount": [
            {
              "description": "If provided, applies the action to a specific attribute instead of the default one.",
              "label": "Apply on",
              "mutuallyExclusiveWith": [],
              "name": "apply_on",
              "valueType": "string",
            },
            {
              "description": "The type of distribution of the discount over the items.",
              "enum": [
                "distributed",
                "default",
              ],
              "label": "Discount mode",
              "mutuallyExclusiveWith": [],
              "name": "discount_mode",
              "valueType": "string",
            },
          ],
          "fixed_price": [
            {
              "description": "If provided, applies the action to a specific attribute instead of the default one.",
              "label": "Apply on",
              "mutuallyExclusiveWith": [],
              "name": "apply_on",
              "valueType": "string",
            },
          ],
          "percentage": [
            {
              "description": "If true, rounds the discount, only available on percentage actions.",
              "label": "Round",
              "mutuallyExclusiveWith": [],
              "name": "round",
              "valueType": "boolean",
            },
            {
              "description": "If provided, applies the action to a specific attribute instead of the default one.",
              "label": "Apply on",
              "mutuallyExclusiveWith": [],
              "name": "apply_on",
              "valueType": "string",
            },
          ],
        },
        "conditions": [
          {
            "description": "Policy to determine if a condition is a match. If value is any (default), it will match as long as one fact it's a match, if value is all, it will match if all facts are a match.",
            "enum": [
              "any",
              "all",
            ],
            "label": "Scope",
            "mutuallyExclusiveWith": [],
            "name": "scope",
            "valueType": "string",
          },
        ],
      }
    `)
  })

  it("should return empty config for invalid schema", () => {
    const config = parseOptionsFromSchema(null)

    expect(config).toMatchInlineSnapshot(`
      {
        "actions": {},
        "conditions": [],
      }
    `)
  })
})

describe("useAvailableOptions", () => {
  it("should return all options as available when no options are set", () => {
    const mockOptionsConfig = [
      {
        name: "round",
        label: "Round",
        mutuallyExclusiveWith: [],
      },
      {
        name: "limit",
        label: "Limit",
        mutuallyExclusiveWith: ["bundle"],
      },
      {
        name: "bundle",
        label: "Bundle",
        mutuallyExclusiveWith: ["limit"],
      },
    ]

    const item = {
      type: "percentage" as const,
      selector: "order",
      value: 0.1,
      groups: [],
    }

    const result = useAvailableOptions(item, mockOptionsConfig)

    expect(result).toMatchInlineSnapshot(`
      {
        "available": [
          {
            "label": "Round",
            "mutuallyExclusiveWith": [],
            "name": "round",
          },
          {
            "label": "Limit",
            "mutuallyExclusiveWith": [
              "bundle",
            ],
            "name": "limit",
          },
          {
            "label": "Bundle",
            "mutuallyExclusiveWith": [
              "limit",
            ],
            "name": "bundle",
          },
        ],
        "current": [],
        "disabled": [],
      }
    `)
  })

  it("should exclude mutually exclusive options when bundle is set", () => {
    const mockOptionsConfig = [
      {
        name: "round",
        label: "Round",
        mutuallyExclusiveWith: [],
      },
      {
        name: "limit",
        label: "Limit",
        mutuallyExclusiveWith: ["bundle"],
      },
      {
        name: "bundle",
        label: "Bundle",
        mutuallyExclusiveWith: ["limit"],
      },
    ]

    const item = {
      type: "percentage" as const,
      selector: "order",
      value: 0.1,
      groups: [],
      bundle: {
        type: "balanced" as const,
        sort: { attribute: "quantity", direction: "asc" as const },
      },
    }

    const result = useAvailableOptions(item, mockOptionsConfig)

    expect(result).toMatchInlineSnapshot(`
      {
        "available": [
          {
            "label": "Round",
            "mutuallyExclusiveWith": [],
            "name": "round",
          },
        ],
        "current": [
          "bundle",
        ],
        "disabled": [
          {
            "label": "Limit",
            "mutuallyExclusiveWith": [
              "bundle",
            ],
            "name": "limit",
          },
        ],
      }
    `)
  })

  it("should exclude mutually exclusive options when limit is set", () => {
    const mockOptionsConfig = [
      {
        name: "round",
        label: "Round",
        mutuallyExclusiveWith: [],
      },
      {
        name: "limit",
        label: "Limit",
        mutuallyExclusiveWith: ["bundle"],
      },
      {
        name: "bundle",
        label: "Bundle",
        mutuallyExclusiveWith: ["limit"],
      },
    ]

    const item = {
      type: "percentage" as const,
      selector: "order",
      value: 0.1,
      limit: {
        value: 1,
        sort: { attribute: "quantity", direction: "asc" as const },
      },
    }

    const result = useAvailableOptions(item, mockOptionsConfig)

    expect(result).toMatchInlineSnapshot(`
      {
        "available": [
          {
            "label": "Round",
            "mutuallyExclusiveWith": [],
            "name": "round",
          },
        ],
        "current": [
          "limit",
        ],
        "disabled": [
          {
            "label": "Bundle",
            "mutuallyExclusiveWith": [
              "limit",
            ],
            "name": "bundle",
          },
        ],
      }
    `)
  })

  it("should exclude already set options from available list", () => {
    const mockOptionsConfig = [
      {
        name: "round",
        label: "Round",
        mutuallyExclusiveWith: [],
      },
      {
        name: "apply_on",
        label: "Apply on",
        mutuallyExclusiveWith: [],
      },
    ]

    const item = {
      type: "percentage" as const,
      selector: "order",
      value: 0.1,
      groups: [],
      round: true,
    }

    const result = useAvailableOptions(item, mockOptionsConfig)

    expect(result).toMatchInlineSnapshot(`
      {
        "available": [
          {
            "label": "Apply on",
            "mutuallyExclusiveWith": [],
            "name": "apply_on",
          },
        ],
        "current": [
          "round",
        ],
        "disabled": [],
      }
    `)
  })

  it("should return empty lists when item is null", () => {
    const mockOptionsConfig = [
      {
        name: "round",
        label: "Round",
        mutuallyExclusiveWith: [],
      },
    ]

    const result = useAvailableOptions(null, mockOptionsConfig)

    expect(result).toMatchInlineSnapshot(`
      {
        "available": [],
        "current": [],
        "disabled": [],
      }
    `)
  })
})

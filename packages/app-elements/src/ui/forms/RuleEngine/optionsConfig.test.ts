import { describe, expect, it } from "vitest"
import orderRulesSchema from "./json_schema/order_rules.json"
import priceRulesSchema from "./json_schema/price_rules.json"
import { parseOptionsFromSchema, useAvailableOptions } from "./optionsConfig"

describe("parseOptionsFromSchema", () => {
  it("should parse order rules schema and extract action options with mutual exclusivity", () => {
    const config = parseOptionsFromSchema(
      orderRulesSchema as any,
      "order-rules",
    )

    expect(config).toMatchInlineSnapshot(`
      {
        "actions": {
          "buy_x_pay_y": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
            ],
            "order": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.adjustment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.bundle": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.gift_card": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.line_item_options": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.payment_method": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.shipment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.sku": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
          },
          "every_x_discount_y": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
            ],
            "order": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.adjustment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.bundle": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.gift_card": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.line_item_options": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.payment_method": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.shipment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.sku": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
          },
          "fixed_amount": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "Creates bundles based on the groups provided.",
                "label": "Bundle",
                "mutuallyExclusiveWith": [
                  "limit",
                ],
                "name": "bundle",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Subtotal amount",
                    "value": "subtotal_amount_cents",
                  },
                  {
                    "label": "Total amount",
                    "value": "total_amount_cents",
                  },
                ],
              },
              {
                "description": "The type of distribution of the discount over the items.",
                "label": "Discount mode",
                "mutuallyExclusiveWith": [],
                "name": "discount_mode",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Distributed",
                    "value": "distributed",
                  },
                  {
                    "label": "Default",
                    "value": "default",
                  },
                ],
              },
              {
                "description": "Restriction on how many resources will be affected by the action.",
                "label": "Limit",
                "mutuallyExclusiveWith": [
                  "bundle",
                ],
                "name": "limit",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "Creates bundles based on the groups provided.",
                "label": "Bundle",
                "mutuallyExclusiveWith": [
                  "limit",
                ],
                "name": "bundle",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Unit amount",
                    "value": "unit_amount_cents",
                  },
                  {
                    "label": "Compare at amount",
                    "value": "compare_at_amount_cents",
                  },
                ],
              },
              {
                "description": "The type of distribution of the discount over the items.",
                "label": "Discount mode",
                "mutuallyExclusiveWith": [],
                "name": "discount_mode",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Distributed",
                    "value": "distributed",
                  },
                  {
                    "label": "Default",
                    "value": "default",
                  },
                ],
              },
              {
                "description": "Restriction on how many resources will be affected by the action.",
                "label": "Limit",
                "mutuallyExclusiveWith": [
                  "bundle",
                ],
                "name": "limit",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items.adjustment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.bundle": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.gift_card": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.line_item_options": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.payment_method": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.shipment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.sku": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
          },
          "fixed_price": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "Creates bundles based on the groups provided.",
                "label": "Bundle",
                "mutuallyExclusiveWith": [
                  "limit",
                ],
                "name": "bundle",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Subtotal amount",
                    "value": "subtotal_amount_cents",
                  },
                  {
                    "label": "Total amount",
                    "value": "total_amount_cents",
                  },
                ],
              },
              {
                "description": "Restriction on how many resources will be affected by the action.",
                "label": "Limit",
                "mutuallyExclusiveWith": [
                  "bundle",
                ],
                "name": "limit",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "Creates bundles based on the groups provided.",
                "label": "Bundle",
                "mutuallyExclusiveWith": [
                  "limit",
                ],
                "name": "bundle",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Unit amount",
                    "value": "unit_amount_cents",
                  },
                  {
                    "label": "Compare at amount",
                    "value": "compare_at_amount_cents",
                  },
                ],
              },
              {
                "description": "Restriction on how many resources will be affected by the action.",
                "label": "Limit",
                "mutuallyExclusiveWith": [
                  "bundle",
                ],
                "name": "limit",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items.adjustment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.bundle": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.gift_card": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.line_item_options": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.payment_method": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.shipment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.sku": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
          },
          "free_gift": {
            "": [
              {
                "description": "Object whose keys are allowed selector paths (order.line_items.sku.id, order.line_items.bundle.id, order.line_items.sku.sku_lists.id). Each value is an array of ids to match. Line items matching any (selector, id) are eligible for the free gift.",
                "label": "Identifiers",
                "mutuallyExclusiveWith": [],
                "name": "identifiers",
                "required": true,
                "valueType": "object",
                "values": [
                  {
                    "label": "SKU",
                    "value": "order.line_items.sku.id",
                  },
                  {
                    "label": "Bundle",
                    "value": "order.line_items.bundle.id",
                  },
                  {
                    "label": "SKU list",
                    "value": "order.line_items.sku.sku_lists.id",
                  },
                ],
              },
              {
                "description": "Total number of units to discount across all matching line items. Distributed in priority order (keys, then ids, then line item order). Required.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": true,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order": [
              {
                "description": "Object whose keys are allowed selector paths (order.line_items.sku.id, order.line_items.bundle.id, order.line_items.sku.sku_lists.id). Each value is an array of ids to match. Line items matching any (selector, id) are eligible for the free gift.",
                "label": "Identifiers",
                "mutuallyExclusiveWith": [],
                "name": "identifiers",
                "required": true,
                "valueType": "object",
                "values": [
                  {
                    "label": "SKU",
                    "value": "order.line_items.sku.id",
                  },
                  {
                    "label": "Bundle",
                    "value": "order.line_items.bundle.id",
                  },
                  {
                    "label": "SKU list",
                    "value": "order.line_items.sku.sku_lists.id",
                  },
                ],
              },
              {
                "description": "Total number of units to discount across all matching line items. Distributed in priority order (keys, then ids, then line item order). Required.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": true,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items": [
              {
                "description": "Total number of units to discount across all matching line items. Distributed in priority order (keys, then ids, then line item order). Required.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": true,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items.adjustment": [],
            "order.line_items.bundle": [],
            "order.line_items.gift_card": [],
            "order.line_items.line_item_options": [],
            "order.line_items.payment_method": [],
            "order.line_items.shipment": [],
            "order.line_items.sku": [],
          },
          "percentage": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "If true, rounds the discount, only available on percentage actions.",
                "label": "Round",
                "mutuallyExclusiveWith": [],
                "name": "round",
                "required": false,
                "valueType": "boolean",
                "values": undefined,
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Subtotal amount",
                    "value": "subtotal_amount_cents",
                  },
                  {
                    "label": "Total amount",
                    "value": "total_amount_cents",
                  },
                ],
              },
              {
                "description": "Creates bundles based on the groups provided.",
                "label": "Bundle",
                "mutuallyExclusiveWith": [
                  "limit",
                ],
                "name": "bundle",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Restriction on how many resources will be affected by the action.",
                "label": "Limit",
                "mutuallyExclusiveWith": [
                  "bundle",
                ],
                "name": "limit",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "total_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "If true, rounds the discount, only available on percentage actions.",
                "label": "Round",
                "mutuallyExclusiveWith": [],
                "name": "round",
                "required": false,
                "valueType": "boolean",
                "values": undefined,
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Unit amount",
                    "value": "unit_amount_cents",
                  },
                  {
                    "label": "Compare at amount",
                    "value": "compare_at_amount_cents",
                  },
                ],
              },
              {
                "description": "Creates bundles based on the groups provided.",
                "label": "Bundle",
                "mutuallyExclusiveWith": [
                  "limit",
                ],
                "name": "bundle",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Restriction on how many resources will be affected by the action.",
                "label": "Limit",
                "mutuallyExclusiveWith": [
                  "bundle",
                ],
                "name": "limit",
                "required": false,
                "valueType": "object",
                "values": [
                  {
                    "label": "Most expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "desc",
                    },
                    "value": "most-expensive",
                  },
                  {
                    "label": "Less expensive",
                    "meta": {
                      "attribute": "unit_amount_cents",
                      "direction": "asc",
                    },
                    "value": "less-expensive",
                  },
                ],
              },
              {
                "description": "Optional quantity to override the resource quantity. If specified, the action will apply to the minimum of specified quantity and resource quantity.",
                "label": "Quantity",
                "mutuallyExclusiveWith": [],
                "name": "quantity",
                "required": false,
                "valueType": "integer",
                "values": undefined,
              },
            ],
            "order.line_items.adjustment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.bundle": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.gift_card": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.line_item_options": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.payment_method": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.shipment": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
            "order.line_items.sku": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
            ],
          },
        },
        "conditions": [
          {
            "description": "Policy to determine if a condition is a match. If value is any (default), it will match as long as one fact it's a match, if value is all, it will match if all facts are a match.",
            "label": "Scope",
            "mutuallyExclusiveWith": [],
            "name": "scope",
            "required": false,
            "valueType": "string",
            "values": [
              {
                "label": "Any",
                "value": "any",
              },
              {
                "label": "All",
                "value": "all",
              },
            ],
          },
          {
            "description": "Identifier of the group to assign the matches of the condition invoked.",
            "label": "Group",
            "mutuallyExclusiveWith": [],
            "name": "group",
            "required": false,
            "valueType": "string",
            "values": undefined,
          },
          {
            "description": "Aggregation conditions to execute within the result of the existing condition.",
            "label": "Aggregations",
            "mutuallyExclusiveWith": [],
            "name": "aggregations",
            "required": false,
            "valueType": "array",
            "values": [
              {
                "label": "Total quantity",
                "meta": {
                  "field": "order.line_items.quantity",
                  "operator": "sum",
                },
                "value": "total-quantity",
              },
              {
                "label": "Total amount",
                "meta": {
                  "field": "order.line_items.total_amount_cents",
                  "operator": "sum",
                },
                "value": "total-amount",
              },
            ],
          },
        ],
      }
    `)
  })

  it("should parse price rules schema and extract action options with mutual exclusivity", () => {
    const config = parseOptionsFromSchema(
      priceRulesSchema as any,
      "price-rules",
    )

    expect(config).toMatchInlineSnapshot(`
      {
        "actions": {
          "fixed_amount": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
            ],
            "price": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Amount",
                    "value": "amount_cents",
                  },
                  {
                    "label": "Compare at amount",
                    "value": "compare_at_amount_cents",
                  },
                ],
              },
            ],
          },
          "fixed_price": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
            ],
            "price": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Amount",
                    "value": "amount_cents",
                  },
                  {
                    "label": "Compare at amount",
                    "value": "compare_at_amount_cents",
                  },
                ],
              },
            ],
          },
          "percentage": {
            "": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
            ],
            "price": [
              {
                "description": "The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.",
                "label": "Apply to",
                "mutuallyExclusiveWith": [],
                "name": "selector",
                "required": true,
                "valueType": "string",
                "values": undefined,
              },
              {
                "description": "The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).",
                "label": "Groups",
                "mutuallyExclusiveWith": [],
                "name": "groups",
                "required": true,
                "valueType": "array",
                "values": undefined,
              },
              {
                "description": "If provided, applies the action to a specific attribute instead of the default one.",
                "label": "Apply on",
                "mutuallyExclusiveWith": [],
                "name": "apply_on",
                "required": false,
                "valueType": "string",
                "values": [
                  {
                    "label": "Amount",
                    "value": "amount_cents",
                  },
                  {
                    "label": "Compare at amount",
                    "value": "compare_at_amount_cents",
                  },
                ],
              },
            ],
          },
        },
        "conditions": [
          {
            "description": "Policy to determine if a condition is a match. If value is any (default), it will match as long as one fact it's a match, if value is all, it will match if all facts are a match.",
            "label": "Scope",
            "mutuallyExclusiveWith": [],
            "name": "scope",
            "required": false,
            "valueType": "string",
            "values": [
              {
                "label": "Any",
                "value": "any",
              },
              {
                "label": "All",
                "value": "all",
              },
            ],
          },
          {
            "description": "Identifier of the group to assign the matches of the condition invoked.",
            "label": "Group",
            "mutuallyExclusiveWith": [],
            "name": "group",
            "required": false,
            "valueType": "string",
            "values": undefined,
          },
        ],
      }
    `)
  })

  it("should return empty config for invalid schema", () => {
    const config = parseOptionsFromSchema(null, "order-rules")

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
        "required": [],
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
        "required": [],
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
      groups: [],
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
        "required": [],
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
        "required": [],
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
        "required": [],
      }
    `)
  })
})

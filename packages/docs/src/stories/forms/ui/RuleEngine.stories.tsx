import type { Meta, StoryFn } from "@storybook/react-vite"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { RuleEngine } from "#ui/forms/RuleEngine"

const setup: Meta<typeof RuleEngine> = {
  title: "Forms/ui/RuleEngine",
  component: RuleEngine,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "700px" }}>
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is a controlled example.
          dangerouslySetInnerHTML={{
            __html: `.sbdocs.sbdocs-content { max-width: 95%; }`,
          }}
        />
        <Story />
      </div>
    ),
  ],
}
export default setup

const Template: StoryFn<typeof RuleEngine> = (args) => {
  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <RuleEngine {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: "rules",
  schemaType: "order-rules",
  onChange(value) {
    console.log("onChange", value)
  },
  defaultValue: JSON.stringify(
    {
      rules: [
        {
          id: "d4e5f6a7-b8c9-0d1e-2f3g-4h5i6j7k8l9m",
          name: "Discount 5% on items that have a big stock",
          actions: [
            {
              type: "percentage",
              value: 0.05,
              groups: ["discountable-items"],
              selector: "order.line_items",
            },
          ],
          conditions: [
            {
              field: "order.line_items.sku.inventory.quantity",
              group: "discountable-items",
              value: 100,
              matcher: "gteq",
            },
            {
              field: "order.line_items.sku.name",
              group: "discountable-items",
              matcher: "blank",
            },
          ],
        },
        {
          id: "d386c750-d8df-494e-b28e-cbce22a449fb",
          name: "Rule for EUR",
          actions: [
            {
              type: "percentage",
              value: 0.23,
              selector: "order",
            },
            {
              type: "fixed_amount",
              value: 5500,
              selector: "order",
              limit: {
                sort: {
                  attribute: "order.line_items",
                  direction: "asc",
                },
                value: 4,
              },
            },
            {
              type: "fixed_price",
              value: 2500,
              selector: "order",
            },
            {
              type: "buy_x_pay_y",
              value: {
                x: 3,
                y: 2,
                result_item_limit: 3,
              },
              selector: "order",
            },
            {
              type: "every_x_discount_y",
              value: {
                x: 5,
                y: 3,
                attribute: "sku_count",
              },
              selector: "order",
            },
          ],
          priority: 0,
          conditions: [
            {
              field: "order.placed_at",
              value: "2025-05-05T15:17:40.977Z",
              matcher: "eq",
            },
            {
              field: "order.created_at",
              value: ["2025-05-05T15:17:40.977Z", "2025-07-05T15:17:40.977Z"],
              matcher: "gt_lt",
            },
            {
              field: "order.total_amount_cents",
              value: [5000, 7000],
              matcher: "gt_lt",
            },
            {
              field: "order.total_amount_cents",
              matcher: "gt",
              value: 50,
            },
            {
              field: "order.tax_included",
              matcher: "eq",
              value: true,
            },
            {
              field: "order.tags.name",
              matcher: "array_match",
              value: {
                in_and: ["discount", "summer"],
                not_in_or: ["accessories"],
              },
            },
            {
              field: "order.tags.name",
              matcher: "is_in",
              value: ["discount", "summer"],
            },
            {
              field: "order.status",
              matcher: "eq",
              value: "draft",
            },
            {
              field: "order.customer_email",
              matcher: "matches",
              value: ".*@example.com",
            },
            {
              field: "order.status",
              matcher: "blank",
            },
            {
              field: "order.line_items.unit_amount_cents",
              matcher: "eq",
              value: "{{order.line_items.compare_at_amount_cents}}",
            },
            {
              field: "order.line_items.unit_amount_cents",
              matcher: "gt_lt",
              value: [
                "{{order.line_items.metadata.min_value}}",
                "{{order.line_items.metadata.max_value}}",
              ],
            },
            {
              field: "order.currency_code",
              value: "EUR",
              matcher: "eq",
              nested: {
                conditions_logic: "and",
                conditions: [
                  {
                    field: "order.status",
                    matcher: "eq",
                    value: "draft",
                  },
                ],
              },
            },
          ],
          conditions_logic: "or",
        },
        {
          id: "b2c8f1d0-3a4e-4b5c-9f6d-7e8f9a0b1c2d",
          name: "Rule for USD",
          actions: [
            {
              type: "percentage",
              value: 0.2,
              selector: "order",
            },
          ],
          priority: 0,
          conditions: [
            {
              field: "order.customer.metadata.date_of_birth",
              value: "2025-05-05T15:17:40.977Z",
              matcher: "eq",
            },
            {
              field: "order.customer.metadata.date_between",
              value: ["2025-05-05T15:17:40.977Z", "2025-07-05T15:17:40.977Z"],
              matcher: "gt_lt",
            },
            {
              field: "order.customer.metadata.number_range",
              value: [5000, 7000],
              matcher: "gt_lt",
            },
            {
              field: "order.customer.metadata.number",
              matcher: "gt",
              value: 50,
            },
            {
              field: "order.customer.metadata.boolean",
              matcher: "eq",
              value: true,
            },
            {
              field: "order.customer.metadata.tags",
              matcher: "array_match",
              value: {
                in_and: ["discount", "summer"],
                not_in_or: ["accessories"],
              },
            },
            {
              field: "order.customer.metadata.tags",
              matcher: "is_in",
              value: ["discount", "summer"],
            },
            {
              field: "order.customer.metadata.status",
              matcher: "eq",
              value: "draft",
            },
            {
              field: "order.customer.metadata.email",
              matcher: "matches",
              value: ".*@example.com",
            },
            {
              field: "order.status",
              matcher: "blank",
            },
            {
              field: "order.metadata.line_items.unit_amount_cents",
              matcher: "eq",
              value: "{{order.line_items.compare_at_amount_cents}}",
            },
            {
              field: "order.metadata.line_items.unit_amount_cents",
              matcher: "gt_lt",
              value: [
                "{{order.line_items.metadata.min_value}}",
                "{{order.line_items.metadata.max_value}}",
              ],
            },
            {
              field: "order.customer.metadata.currency_code",
              value: "USD",
              matcher: "eq",
              nested: {
                conditions_logic: "and",
                conditions: [
                  {
                    field: "order.customer.metadata.status",
                    matcher: "eq",
                    value: "draft",
                  },
                ],
              },
            },
          ],
          conditions_logic: "or",
        },
        {
          id: "c3d4e5f6-7a8b-9c0d-e1f2-3a4b5c6d7e8f",
          name: "Free gift some skus",
          conditions_logic: "or",
          conditions: [
            {
              field: "order.line_items.sku.id",
              matcher: "eq",
              value: "lNdLCKWxlm",
              group: "1000_2000",
              nested: {
                conditions: [
                  {
                    field: "order.subtotal_amount_cents",
                    matcher: "gteq_lteq",
                    group: "1000_2000",
                    value: [1000, 2000],
                  },
                ],
              },
            },
            {
              field: "order.line_items.sku.id",
              matcher: "eq",
              value: "eNdLCKWxly",
              group: "2100_3000",
              nested: {
                conditions: [
                  {
                    field: "order.subtotal_amount_cents",
                    matcher: "gteq_lteq",
                    group: "2100_3000",
                    value: [2100, 3000],
                  },
                ],
              },
            },
            {
              field: "order.line_items.sku.id",
              matcher: "eq",
              value: "oNdLCKWxlq",
              group: "3100",
              nested: {
                conditions: [
                  {
                    field: "order.subtotal_amount_cents",
                    matcher: "gt",
                    group: "3100",
                    value: 3100,
                  },
                ],
              },
            },
          ],
          actions: [
            {
              type: "percentage",
              selector: "order.line_items",
              value: 1,
              groups: ["1000_2000", "2100_3000", "3100"],
            },
          ],
        },
      ],
    },
    undefined,
    2,
  ).concat("\n"),
}
Default.parameters = {
  docs: {
    canvas: {
      // This will remove the "show code" button
      // https://storybook.js.org/docs/api/doc-blocks/doc-block-canvas#sourcestate
      sourceState: "none",
    },
  },
}

export const PriceRules = Template.bind({})
PriceRules.args = {
  name: "rules",
  schemaType: "price-rules",
  onChange(value) {
    console.log("onChange", value)
  },
  defaultValue: JSON.stringify(
    {
      rules: [
        {
          id: "d4e5f6a7-b8c9-0d1e-2f3g-4h5i6j7k8l9m",
          name: "Discount 40% if employee_us",
          actions: [
            {
              type: "percentage",
              value: 0.4,
              groups: ["discountable-items"],
              selector: "price",
            },
          ],
          conditions: [
            {
              field: "price.jwt_customer.tags.name",
              group: "discountable_employee_us",
              value: "employee_us",
              matcher: "matches",
            },
            {
              field: "price.sku.tags.name",
              group: "discountable-items",
              value: {
                not_in_or: ["outlet", "public_40"],
              },
              matcher: "array_match",
            },
          ],
        },
      ],
    },
    undefined,
    2,
  ).concat("\n"),
}
PriceRules.parameters = {
  docs: {
    canvas: {
      // This will remove the "show code" button
      // https://storybook.js.org/docs/api/doc-blocks/doc-block-canvas#sourcestate
      sourceState: "none",
    },
  },
}

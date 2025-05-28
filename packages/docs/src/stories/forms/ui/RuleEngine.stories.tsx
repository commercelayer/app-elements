import { RuleEngine } from '#ui/forms/RuleEngine'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof RuleEngine> = {
  title: 'Forms/ui/RuleEngine',
  component: RuleEngine,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <div>
        <style dangerouslySetInnerHTML={{ __html: `.sbdocs.sbdocs-content { max-width: 95%; }` }} />
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof RuleEngine> = (args) => {
  return (
    <>
      <RuleEngine {...args} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'plaintext',
  defaultValue: JSON.stringify(
    // {
    //   rules: [
    //     {
    //       id: 'b569f656-8bc2-4253-a19b-56062e7653ab',
    //       name: 'Discount 3% if paid by credit card',
    //       conditions: [
    //         {
    //           field: 'order.payment_method.payment_source_type',
    //           matcher: 'eq',
    //           value: 'credit_cards'
    //         }
    //       ],
    //       actions: [
    //         {
    //           type: 'percentage',
    //           selector: 'order',
    //           value: 3
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      "rules": [
        {
          "id": "unique-rule-id-allowanceFT-USD",
          "name": "Staff allowance",
          "actions": [
            {
              "type": "percentage",
              "value": 1,
              "groups": [
                "shipment"
              ],
              "selector": "order.line_items.shipment",
              "discount_mode": "distributed"
            },
            {
              "type": "fixed_amount",
              "value": 77000,
              "groups": [
                "discountable_items"
              ],
              "selector": "order.line_items.sku",
              "discount_mode": "distributed"
            }
          ],
          "conditions": [
            {
              "field": "order.line_items.sku.tags.name",
              "group": "discountable_items",
              "value": {
                "not_in_and": [
                  "product:staffcoderestrictiongroup",
                  "product:archive",
                  "product:sale"
                ]
              },
            },
            {
              "field": "order.line_items.sku.tags.name",
              "group": "discountable_items",
              "value": {
                "not_in_and": [
                  "product:staffcoderestrictiongroup",
                  "product:archive",
                  "product:sale"
                ]
              },
              "nested": {
                "conditions": [
                  {
                    "field": "order.customer.tags.name",
                    "value": {
                      "in_or": [
                        "customer:staff"
                      ]
                    },
                    "matcher": "array_match"
                  },
                  {
                    "field": "order.market.code",
                    "group": "eligible_group",
                    "value": {
                      "in_or": [
                        "US",
                        "USDREST",
                        "RCCUSD",
                        "USDRESTRCC"
                      ]
                    },
                    "matcher": "array_match"
                  }
                ]
              },
              "matcher": "array_match"
            },
            {
              "field": "order.line_items.shipment.shipping_method.reference",
              "group": "shipment",
              "value": "standard",
              "nested": {
                "conditions": [
                  {
                    "field": "order.customer.tags.name",
                    "value": {
                      "in_or": [
                        "customer:staff"
                      ]
                    },
                    "matcher": "array_match",
                    "nested": {
                      "conditions": [
                        {
                          "field": "order.customer.tags.name",
                          "value": {
                            "in_or": [
                              "customer:staff"
                            ]
                          },
                          "matcher": "array_match"
                        },
                        {
                          "field": "order.market.code",
                          "group": "eligible_group",
                          "value": {
                            "in_or": [
                              "US",
                              "USDREST",
                              "RCCUSD",
                              "USDRESTRCC"
                            ]
                          },
                          "matcher": "array_match"
                        }
                      ]
                    },
                  }
                ]
              },
              "matcher": "eq"
            }
          ],
          "conditions_logic": "or"
        }
      ]
    },
    undefined,
    2
  ).concat('\n')
}

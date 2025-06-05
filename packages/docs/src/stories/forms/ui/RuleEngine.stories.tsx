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
      <div style={{ height: '600px' }}>
        <style
          dangerouslySetInnerHTML={{
            __html: `.sbdocs.sbdocs-content { max-width: 95%; }`
          }}
        />
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
  name: 'rules',
  onChange(value) {
    console.log('onChange', value)
  },
  defaultValue: JSON.stringify(
    {
      rules: [
        {
          id: 'rule-for-eur-1234',
          name: 'Rule for EUR',
          actions: [
            {
              type: 'percentage',
              value: 25 / 100,
              selector: 'order'
            },
            {
              type: 'fixed_amount',
              value: 5500,
              selector: 'order'
            },
            {
              type: 'fixed_price',
              value: 2500,
              selector: 'order'
            }
          ],
          priority: 0,
          conditions: [
            {
              field: 'order.placed_at',
              value: '2025-05-05T15:17:40.977Z',
              matcher: 'eq',
              nested: {
                condition_logic: 'and',
                conditions: [
                  {
                    field: 'order.created_at',
                    value: [
                      '2025-05-05T15:17:40.977Z',
                      '2025-07-05T15:17:40.977Z'
                    ],
                    matcher: 'gt_lt'
                  },
                  {
                    field: 'order.total_amount_cents',
                    matcher: 'gt',
                    value: 50
                  }
                ]
              }
            },
            {
              field: 'order.tax_included',
              matcher: 'eq',
              value: true
            }
          ],
          conditions_logic: 'or'
        },
        {
          id: '6dbbe544-e191-4506-aed5-9d0ca1d25cby',
          name: 'Free gift some skus',
          conditions_logic: 'or',
          conditions: [
            {
              field: 'order.line_items.sku.id',
              matcher: 'eq',
              value: 'lNdLCKWxlm',
              group: '1000_2000',
              nested: {
                conditions: [
                  {
                    field: 'order.subtotal_amount_cents',
                    matcher: 'gteq_lteq',
                    group: '1000_2000',
                    value: [1000, 2000]
                  }
                ]
              }
            },
            {
              field: 'order.line_items.sku.id',
              matcher: 'eq',
              value: 'eNdLCKWxly',
              group: '2100_3000',
              nested: {
                conditions: [
                  {
                    field: 'order.subtotal_amount_cents',
                    matcher: 'gteq_lteq',
                    group: '2100_3000',
                    value: [2100, 3000]
                  }
                ]
              }
            },
            {
              field: 'order.line_items.sku.id',
              matcher: 'eq',
              value: 'oNdLCKWxlq',
              group: '3100',
              nested: {
                conditions: [
                  {
                    field: 'order.subtotal_amount_cents',
                    matcher: 'gt',
                    group: '3100',
                    value: 3100
                  }
                ]
              }
            }
          ],
          actions: [
            {
              type: 'percentage',
              selector: 'order.line_items',
              value: 1.0,
              groups: ['1000_2000', '2100_3000', '3100']
            }
          ]
        }
      ]
    },
    undefined,
    2
  ).concat('\n')
}

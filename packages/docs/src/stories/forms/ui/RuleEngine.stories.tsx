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
          id: 'bff-eur',
          name: 'Bonus-for-Friends Angebot eur',
          actions: [
            {
              type: 'percentage',
              value: 25 / 100,
              groups: ['singlevision'],
              selector: 'order'
            },
            {
              type: 'fixed_amount',
              value: 5500,
              groups: ['progressive'],
              selector: 'order'
            },
            {
              type: 'fixed_price',
              value: 2500,
              groups: ['progressive'],
              selector: 'order'
            }
          ],
          priority: 0,
          conditions: [
            {
              field: 'order.placed_at',
              group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
              value: '2025-05-05T15:17:40.977Z',
              matcher: 'eq'
            },
            {
              field: 'order.created_at',
              group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
              value: ['2025-05-05T15:17:40.977Z', '2025-07-05T15:17:40.977Z'],
              matcher: 'gt_lt'
            },
            {
              field: 'order.total_amount_cents',
              group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
              matcher: 'gt',
              value: 50
            },
            {
              field: 'order.tax_included',
              group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
              matcher: 'eq',
              value: true
            },
            {
              field: 'order.line_items.line_item_options.sku_option.tags.name',
              group: 'progressive',
              value: {
                in_and: ['progressive']
              },
              nested: {
                conditions: [
                  {
                    field: 'order.currency_code',
                    group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
                    value: 'EUR',
                    matcher: 'eq'
                  },
                  {
                    field: 'order.customer.status',
                    group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
                    value: 'prospect',
                    matcher: 'eq'
                  }
                ]
              },
              matcher: 'array_match'
            },
            {
              field: 'order.line_items.line_item_options.sku_option.tags.name',
              group: 'singlevision',
              value: {
                in_or: ['singlevision']
              },
              nested: {
                conditions: [
                  {
                    field: 'order.currency_code',
                    group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
                    value: 'EUR',
                    matcher: 'eq'
                  },
                  {
                    field: 'order.customer.status',
                    group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
                    value: 'prospect',
                    matcher: 'eq'
                  }
                ]
              },
              matcher: 'array_match'
            }
          ],
          conditions_logic: 'or'
        },
        {
          id: 'bff-chf',
          name: 'Bonus-for-Friends Angebot',
          actions: [
            {
              type: 'fixed_amount',
              value: 3000,
              groups: ['singlevision'],
              selector: 'order'
            }
          ],
          priority: 1,
          conditions: [
            {
              field: 'order.line_items.line_item_options.sku_option.tags.name',
              group: 'progressive',
              value: {
                in_and: ['progressive']
              },
              matcher: 'array_match'
            },
            {
              field: 'order.line_items.line_item_options.sku_option.tags.name',
              group: 'singlevision',
              value: {
                in_or: ['singlevision']
              },
              nested: {
                conditions: [
                  {
                    field: 'order.currency_code',
                    group: 'd539ce1e-096f-4747-a2c1-c2a7794ed5fa',
                    value: 'CHF',
                    matcher: 'eq'
                  }
                ]
              },
              matcher: 'array_match'
            }
          ],
          conditions_logic: 'or'
        }
      ]
    },
    undefined,
    2
  ).concat('\n')
}

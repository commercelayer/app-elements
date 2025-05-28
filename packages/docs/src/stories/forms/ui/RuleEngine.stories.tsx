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
      rules: [
        {
          id: 'bff-eur',
          name: 'Bonus-for-Friends Angebot eur',
          actions: [
            {
              type: 'fixed_amount',
              value: 2500,
              groups: ['singlevision'],
              selector: 'order'
            },
            {
              type: 'fixed_amount',
              value: 5500,
              groups: ['progressive'],
              selector: 'order'
            }
          ],
          priority: 0,
          conditions: [
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

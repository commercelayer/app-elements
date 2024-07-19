import { ResourceListItem } from '#ui/resources/ResourceListItem'
import { presetResourceListItem } from '#ui/resources/ResourceListItem/ResourceListItem.mocks'
import { type ResourceListItemType } from '#ui/resources/ResourceListItem/types'
import { type Meta, type StoryFn } from '@storybook/react'

type Props = Parameters<typeof ResourceListItem>[0] & {
  preset: Array<keyof typeof presetResourceListItem | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Resources/ResourceListItem',
  component: ResourceListItem,
  argTypes: {
    preset: {
      options: ['custom', ...Object.keys(presetResourceListItem)],
      control: { type: 'check' },
      description: `⚠️ This attribute is **not** a component prop.
        It is meant to be used only within this documentation.
        You can quickly switch to a pre-configured \`ResourceLineItem\`.
      `,
      defaultValue: ['custom']
    }
  },
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<Props> = ({ preset, resource, ...args }) => {
  return (
    <>
      {[
        ...(preset.includes('custom') ? [resource] : []),
        ...preset.filter(
          (p): p is Exclude<Props['preset'][number], 'custom'> => p !== 'custom'
        )
      ].map((p, idx) => {
        return (
          <ResourceListItem
            key={idx}
            {...args}
            resource={typeof p === 'string' ? presetResourceListItem[p] : p}
          />
        )
      })}
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  preset: ['custom'],
  resource: {
    ...presetResourceListItem.orderAwaitingApproval,
    id: 'nIp9785zse'
  },
  onClick() {
    alert('The item was clicked!')
  }
}

type ListProps = Props & {
  type: Array<ResourceListItemType['type']>
}

const ItemsByTypeTemplate: StoryFn<ListProps> = (args) => {
  return (
    <>
      {Object.values(presetResourceListItem)
        .filter((preset) => args.type.includes(preset.type))
        .map((preset, idx) => (
          <ResourceListItem key={idx} resource={preset} />
        ))}
    </>
  )
}

export const Orders = ItemsByTypeTemplate.bind({})
Orders.args = {
  type: ['orders']
}

export const Returns = ItemsByTypeTemplate.bind({})
Returns.args = {
  type: ['returns']
}

export const StockTransfers = ItemsByTypeTemplate.bind({})
StockTransfers.args = {
  type: ['stock_transfers']
}

export const Customers = ItemsByTypeTemplate.bind({})
Customers.args = {
  type: ['customers']
}

export const Shipments = ItemsByTypeTemplate.bind({})
Shipments.args = {
  type: ['shipments']
}

export const Promotions = ItemsByTypeTemplate.bind({})
Promotions.args = {
  type: [
    'buy_x_pay_y_promotions',
    'external_promotions',
    'fixed_amount_promotions',
    'fixed_price_promotions',
    'free_gift_promotions',
    'free_shipping_promotions',
    'percentage_discount_promotions'
  ]
}

import { BlockCode } from '#ui/atoms/BlockCode'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof BlockCode> = {
  title: 'Atoms/BlockCode',
  component: BlockCode
}
export default setup

const Template: ComponentStory<typeof BlockCode> = (args) => (
  <BlockCode {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  json: {
    id: 'xYZkjABcde',
    type: 'orders',
    links: {
      self: 'https://yourdomain.commercelayer.io/api/orders/xYZkjABcde'
    },
    attributes: {
      number: 1234,
      autorefresh: true,
      status: 'draft',
      payment_status: 'unpaid',
      fulfillment_status: 'unfulfilled',
      guest: true
    }
  }
}

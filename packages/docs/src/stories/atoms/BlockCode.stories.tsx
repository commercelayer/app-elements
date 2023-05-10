import { BlockCode } from '#ui/atoms/BlockCode'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof BlockCode> = {
  title: 'Atoms/BlockCode',
  component: BlockCode
}
export default setup

const Template: StoryFn<typeof BlockCode> = (args) => <BlockCode {...args} />

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

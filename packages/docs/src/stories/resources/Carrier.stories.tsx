import { Carrier } from '#ui/resources/Carrier'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Resources/Carrier',
  component: Carrier,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof Carrier> = (args): JSX.Element => (
  <Carrier {...args} />
)
Default.args = {}

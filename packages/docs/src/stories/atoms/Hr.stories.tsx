import { Hr } from '#ui/atoms/Hr'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Hr> = {
  title: 'Atoms/Hr',
  component: Hr,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Hr> = (args) => <Hr {...args} />

export const Default = Template.bind({})
Default.args = {}

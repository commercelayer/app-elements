import { Spacer } from '#ui/atoms/Spacer'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Spacer> = {
  title: 'Atoms/Spacer',
  component: Spacer
}
export default setup

const Template: StoryFn<typeof Spacer> = (args) => <Spacer {...args} />

export const Default = Template.bind({})
Default.args = {
  top: '4',
  bottom: '14',
  children: 'Some content with both margin top and bottom (inspect me)'
}

export const OnlyBottom = Template.bind({})
OnlyBottom.args = {
  top: undefined,
  bottom: '8',
  children: 'Some content with margin bottom only (inspect me)'
}

export const OnlyLeft = Template.bind({})
OnlyLeft.args = {
  top: undefined,
  left: '8',
  children: 'Some content with margin left only (inspect me)'
}

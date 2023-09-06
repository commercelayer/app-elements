import { InputToggleBox } from '#ui/forms/InputToggleBox'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputToggleBox> = {
  title: 'Forms/ui/InputToggleBox',
  component: InputToggleBox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputToggleBox> = (args) => {
  return <InputToggleBox {...args} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'Export format'
}

export const WidthDescription = Template.bind({})
WidthDescription.args = {
  label: 'Export format',
  description: 'Select a format',
  defaultChecked: true
}

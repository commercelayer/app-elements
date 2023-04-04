import { InputToggleListBox } from '#ui/forms/InputToggleListBox'
import { type ComponentMeta, type ComponentStory } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof InputToggleListBox> = {
  title: 'Forms/InputToggleListBox',
  component: InputToggleListBox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputToggleListBox> = (args) => {
  const [value, setValue] = useState(args.value ?? 'json')
  return (
    <InputToggleListBox
      {...args}
      value={value}
      onChange={(e) => {
        setValue(e.currentTarget.value)
      }}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Export format',
  value: 'json',
  options: [
    { label: 'JSON', value: 'json' },
    {
      label: 'CSV',
      value: 'csv'
    }
  ]
}

export const WidthDescription = Template.bind({})
WidthDescription.args = {
  label: 'Export format',
  description: 'Select a format',
  value: 'json',
  options: [
    { label: 'JSON', value: 'json' },
    {
      label: 'CSV',
      value: 'csv'
    }
  ]
}

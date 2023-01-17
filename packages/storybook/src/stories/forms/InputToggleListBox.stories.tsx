import InputToggleListBox from '#core-app-elements/forms/InputToggleListBox'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
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
  const [value, setValue] = useState('json')
  return (
    <Container minHeight={false}>
      <InputToggleListBox {...args} value={value} onSelect={setValue} />
    </Container>
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

import { HookedInputToggleListBox } from '#ui/forms/InputToggleListBox'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputToggleListBox> = {
  title: 'Forms/react-hook-form/HookedInputToggleListBox',
  component: HookedInputToggleListBox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputToggleListBox> = (args) => {
  return (
    <HookedForm>
      <HookedInputToggleListBox {...args} name='myField' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Select a format',
  options: [
    {
      value: 'csv',
      label: 'CSV'
    },
    {
      value: 'json',
      label: 'JSON'
    }
  ]
}

// populate default values for the form used in `MockedHookedForm`
;(window as any).hookedFormDefaultValues = {
  myField: 'json'
}

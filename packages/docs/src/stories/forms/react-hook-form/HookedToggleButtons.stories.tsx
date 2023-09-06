import { HookedInputToggleButton } from '#ui/forms/InputToggleButton'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputToggleButton> = {
  title: 'Forms/react-hook-form/HookedInputToggleButton',
  component: HookedInputToggleButton,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputToggleButton> = (args) => {
  return (
    <HookedForm>
      <HookedInputToggleButton {...args} name='myOptions' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  options: [
    {
      value: 'authorized',
      label: 'Authorized'
    },
    {
      value: 'paid',
      label: 'Paid'
    },
    {
      value: 'voided',
      label: 'Voided'
    }
  ],
  label: 'Select an option',
  mode: 'multi'
}

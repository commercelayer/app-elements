import { HookedToggleButtons } from '#ui/forms/ToggleButtons'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedToggleButtons> = {
  title: 'Forms/react-hook-form/HookedToggleButtons',
  component: HookedToggleButtons,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedToggleButtons> = (args) => {
  return (
    <HookedForm>
      <HookedToggleButtons {...args} name='myOptions' />
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

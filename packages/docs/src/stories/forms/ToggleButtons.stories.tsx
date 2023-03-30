import { ToggleButtons, type ToggleButtonOption } from '#ui/forms/ToggleButtons'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

const options: ToggleButtonOption[] = [
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
  },
  {
    value: 'refunded',
    label: 'Refunded'
  },
  {
    value: 'free',
    label: 'Free'
  }
]
const optionsWithDisabled: ToggleButtonOption[] = options.map((opt, idx) =>
  idx === 2
    ? {
        ...opt,
        isDisabled: true
      }
    : opt
)

const setup: ComponentMeta<typeof ToggleButtons> = {
  title: 'Forms/ToggleButtons',
  component: ToggleButtons
}
export default setup

const Template: ComponentStory<typeof ToggleButtons> = (args) => {
  const [value, setValue] = useState<any>(args.value)
  return <ToggleButtons {...args} value={value} onChange={setValue} />
}

export const SingleMode = Template.bind({})
SingleMode.args = {
  options,
  mode: 'single'
}

export const MultiMode = Template.bind({})
MultiMode.args = {
  options,
  mode: 'multi',
  value: ['voided', 'refunded'],
  label: 'Payment status',
  hint: {
    text: 'Please select one or multiple options'
  }
}

export const WithDisabledItem = Template.bind({})
WithDisabledItem.args = {
  options: optionsWithDisabled,
  mode: 'single',
  value: 'paid'
}

export const WithError = Template.bind({})
WithError.args = {
  options,
  mode: 'multi',
  feedback: {
    variant: 'danger',
    message: 'Please select at least one option'
  }
}

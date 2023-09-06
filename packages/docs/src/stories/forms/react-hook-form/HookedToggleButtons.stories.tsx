import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputToggleButton } from '#ui/forms/InputToggleButton'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputToggleButton> = {
  title: 'Forms/react-hook-form/HookedInputToggleButton',
  component: HookedInputToggleButton,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}
export default setup

const Template: StoryFn<typeof HookedInputToggleButton> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputToggleButton {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'myOptions',
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

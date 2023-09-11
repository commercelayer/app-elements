import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputSpinner } from '#ui/forms/InputSpinner'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputSpinner> = {
  title: 'Forms/react-hook-form/HookedInputSpinner',
  component: HookedInputSpinner,
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

const Template: StoryFn<typeof HookedInputSpinner> = (args) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: 4
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSpinner {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Quantity',
  name: 'quantity',
  max: 10,
  min: 0
}

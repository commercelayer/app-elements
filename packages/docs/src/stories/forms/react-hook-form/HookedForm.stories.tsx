import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedForm> = {
  title: 'Forms/react-hook-form/HookedForm',
  component: HookedForm,
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

const Template: StoryFn<typeof HookedForm> = (args) => {
  const methods = useForm({
    defaultValues: {}
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(`form submitted with values: ${JSON.stringify(values)}`)
      }}
    >
      <div>hooked form fields here ...</div>
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

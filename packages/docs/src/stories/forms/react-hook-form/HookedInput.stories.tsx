import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInput> = {
  title: 'Forms/react-hook-form/HookedInput',
  component: HookedInput,
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

const Template: StoryFn<typeof HookedInput> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values): void => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInput {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'First name',
  name: 'firstname'
}

export const WithSuffix = Template.bind({})
WithSuffix.args = {
  type: 'number',
  label: 'Assign a priority',
  name: 'priority',
  suffix: 'index'
}

import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputCheckbox } from '#ui/forms/InputCheckbox'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputCheckbox> = {
  title: 'Forms/react-hook-form/HookedInputCheckbox',
  component: HookedInputCheckbox,
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

const Template: StoryFn<typeof HookedInputCheckbox> = (args) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: true
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputCheckbox {...args}>check me</HookedInputCheckbox>
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'myCheckboxField'
}

import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import { HookedInputCheckbox } from '#ui/forms/InputCheckbox'
import { HookedInputDate } from '#ui/forms/InputDate'
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
      <Spacer top='4'>
        <HookedInput name='firstname' label='Firstname' />
      </Spacer>
      <Spacer top='4'>
        <HookedInput name='lastname' label='Lastname' />
      </Spacer>
      <Spacer top='4'>
        <HookedInputDate name='dateofbirth' label='Date of birth' />
      </Spacer>
      <Spacer top='4'>
        <HookedInputCheckbox name='privacy'>
          Accept privacy policy
        </HookedInputCheckbox>
      </Spacer>
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

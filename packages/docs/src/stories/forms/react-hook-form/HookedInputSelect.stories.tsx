import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputSelect } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputSelect> = {
  title: 'Forms/react-hook-form/HookedInputSelect',
  component: HookedInputSelect,
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

const Template: StoryFn<typeof HookedInputSelect> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSelect {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'City',
  name: 'city',
  initialValues: [
    {
      value: 'paris',
      label: 'Paris'
    },
    {
      value: 'rome',
      label: 'Rome'
    },
    {
      value: 'london',
      label: 'London'
    }
  ]
}

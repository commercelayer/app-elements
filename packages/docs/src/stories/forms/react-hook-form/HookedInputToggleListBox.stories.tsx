import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputToggleListBox } from '#ui/forms/InputToggleListBox'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputToggleListBox> = {
  title: 'Forms/react-hook-form/HookedInputToggleListBox (DEPRECATED)',
  component: HookedInputToggleListBox,
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

const Template: StoryFn<typeof HookedInputToggleListBox> = (args) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: 'json'
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputToggleListBox {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'myField',
  label: 'Select a format',
  options: [
    {
      value: 'csv',
      label: 'CSV'
    },
    {
      value: 'json',
      label: 'JSON'
    }
  ]
}

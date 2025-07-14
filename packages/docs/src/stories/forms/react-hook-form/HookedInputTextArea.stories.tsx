import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputTextArea } from '#ui/forms/InputTextArea'
import { type Meta, type StoryFn } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputTextArea> = {
  title: 'Forms/react-hook-form/HookedInputTextArea',
  component: HookedInputTextArea,
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

const Template: StoryFn<typeof HookedInputTextArea> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputTextArea {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Notes',
  name: 'notes'
}

import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputDateRange } from '#ui/forms/InputDateRange'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputDateRange> = {
  title: 'Forms/react-hook-form/HookedInputDateRange',
  component: HookedInputDateRange,
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

const Template: StoryFn<typeof HookedInputDateRange> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputDateRange {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Date range',
  name: 'myFormField'
}

import { HookedInputDate } from '#ui/forms/InputDate'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputDate> = {
  title: 'Forms/react-hook-form/HookedInputDate',
  component: HookedInputDate,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputDate> = (args) => {
  return (
    <HookedForm>
      <HookedInputDate {...args} name='myFormField' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

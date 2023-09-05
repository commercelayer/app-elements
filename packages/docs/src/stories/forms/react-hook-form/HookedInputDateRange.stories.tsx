import { HookedInputDateRange } from '#ui/hook-form/HookedInputDateRange'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputDateRange> = {
  title: 'Forms/react-hook-form/HookedInputDateRange',
  component: HookedInputDateRange,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputDateRange> = (args) => {
  return (
    <HookedForm>
      <HookedInputDateRange {...args} name='myFormField' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

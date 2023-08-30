import { HookedInput } from '#ui/hook-form/HookedInput'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInput> = {
  title: 'HookForm/HookedInput',
  component: HookedInput,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInput> = (args) => {
  return (
    <HookedForm>
      <HookedInput {...args} name='myFormField' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

import { HookedInputToggleBox } from '#ui/hook-form/HookedInputToggleBox'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputToggleBox> = {
  title: 'HookForm/HookedInputToggleBox',
  component: HookedInputToggleBox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputToggleBox> = (args) => {
  return (
    <HookedForm>
      <HookedInputToggleBox {...args} name='myField' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Toggle me'
}

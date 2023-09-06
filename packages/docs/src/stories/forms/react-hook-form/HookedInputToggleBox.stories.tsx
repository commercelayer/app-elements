import { HookedInputToggleBox } from '#ui/forms/InputToggleBox'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputToggleBox> = {
  title: 'Forms/react-hook-form/HookedInputToggleBox',
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

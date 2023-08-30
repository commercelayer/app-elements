import { HookedInputCheckbox } from '#ui/hook-form/HookedInputCheckbox'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputCheckbox> = {
  title: 'HookForm/HookedInputCheckbox',
  component: HookedInputCheckbox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputCheckbox> = (args) => {
  return (
    <HookedForm>
      <HookedInputCheckbox {...args} name='myCheckboxField'>
        check me
      </HookedInputCheckbox>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

// populate default values for the form used in `MockedHookedForm`
;(window as any).hookedFormDefaultValues = {
  myCheckboxField: true
}

import { HookedInputSpinner } from '#ui/hook-form/HookedInputSpinner'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputSpinner> = {
  title: 'HookForm/HookedInputSpinner',
  component: HookedInputSpinner,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputSpinner> = (args) => {
  return (
    <HookedForm>
      <HookedInputSpinner {...args} name='quantity' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  max: 10,
  min: 0
}

// populate default values for the form used in `MockedHookedForm`
;(window as any).hookedFormDefaultValues = {
  quantity: 4
}

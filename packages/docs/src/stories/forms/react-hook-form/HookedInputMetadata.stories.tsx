import { HookedInputMetadata } from '#ui/forms/InputMetadata'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputMetadata> = {
  title: 'Forms/react-hook-form/HookedInputMetadata',
  component: HookedInputMetadata,
  parameters: {
    layout: 'padded'
  }
}
export default setup

// populate default values for the form used in `MockedHookedForm`
;(window as any).hookedFormDefaultValues = {
  myMetadata: {
    firstname: 'John',
    lastname: 'Reed'
  }
}

const Template: StoryFn<typeof HookedInputMetadata> = (args) => {
  return (
    <HookedForm>
      <HookedInputMetadata {...args} name='myMetadata' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

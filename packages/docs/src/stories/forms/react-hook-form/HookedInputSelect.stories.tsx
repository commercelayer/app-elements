import { HookedInputSelect } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputSelect> = {
  title: 'Forms/react-hook-form/HookedInputSelect',
  component: HookedInputSelect,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputSelect> = (args) => {
  return (
    <HookedForm>
      <HookedInputSelect
        {...args}
        name='myFormField'
        initialValues={[
          {
            value: 'paris',
            label: 'Paris'
          },
          {
            value: 'rome',
            label: 'Rome'
          },
          {
            value: 'london',
            label: 'London'
          }
        ]}
      />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {}

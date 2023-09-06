import { HookedInputCurrency } from '#ui/forms/InputCurrency'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputCurrency> = {
  title: 'Forms/react-hook-form/HookedInputCurrency',
  component: HookedInputCurrency,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputCurrency> = (args) => {
  return (
    <HookedForm>
      <HookedInputCurrency {...args} name='myFormField' />
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  currencyCode: 'USD'
}

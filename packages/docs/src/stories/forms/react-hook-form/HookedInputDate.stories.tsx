import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputDate } from '#ui/forms/InputDate'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputDate> = {
  title: 'Forms/react-hook-form/HookedInputDate',
  component: HookedInputDate,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '300px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof HookedInputDate> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputDate {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Shipping date',
  name: 'myFormField'
}

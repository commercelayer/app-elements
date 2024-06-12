import { InputReadonly } from '#ui/forms/InputReadonly'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputReadonly> = {
  title: 'Forms/ui/InputReadonly',
  component: InputReadonly,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputReadonly> = (args) => {
  return (
    <InputReadonly
      {...args}
      value={args.value}
      showCopyAction={args.showCopyAction}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Domain',
  value: 'https://demo-store.commercelayer.io',
  showCopyAction: true
}

export const LongContent = Template.bind({})
LongContent.args = {
  label: 'Full URL',
  value:
    'https://demo-store.commercelayer.io/api/v1/orders/1234567890/line_items/0987654321',
  showCopyAction: true
}

/**
 * This component can be used to hide (from the screen) sensitive information like API keys or secrets.
 */
export const Secret = Template.bind({})
Secret.args = {
  label: 'Secret',
  value: 'elyFpGvqXsOSsvEko6ues2Ua4No1_HxaKH_0rUaFuYiX9',
  showCopyAction: true,
  secret: true
}

/**
 * In this example we are using the `children` prop to render a code snippet with multi-line content.
 * Special characters like `\` need to be escaped with `\\` to be rendered correctly.
 */
export const MultiLine: StoryFn = () => {
  return (
    <InputReadonly label='Login with your admin credentials' showCopyAction>
      {`commercelayer app:login \\
      -i asdGvqXsOSsdko6ueiX9 \\
      -s elyFpGvqXsOSss2Ua4No1_HxaKH_0rUsFuYiX9 \\
      -o demo-store \\
      -a admin`}
    </InputReadonly>
  )
}

export const MultiLineSecret: StoryFn = () => {
  return (
    <InputReadonly
      label='Login with your admin credentials'
      showCopyAction
      secret
    >
      {`commercelayer app:login \\
      -i asdGvqXsOSsdko6ueiX9 \\
      -s elyFpGvqXsOSss2Ua4No1_HxaKH_0rUsFuYiX9 \\
      -o demo-store \\
      -a admin`}
    </InputReadonly>
  )
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Secret',
  value: 'asd6as78d6asds',
  hint: { text: 'Do not share this secret with others' }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Secret',
  value: 'asd6as78d6asds',
  feedback: {
    variant: 'danger',
    message: 'Do not share this secret with others'
  }
}

export const Loading = Template.bind({})
Loading.args = {
  label: 'Secret',
  value: 'asd6as78d6asds',
  isLoading: true,
  hint: { text: 'Do not share this secret with others' }
}

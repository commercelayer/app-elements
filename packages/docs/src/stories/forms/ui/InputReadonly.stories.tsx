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
  label: 'Secret',
  value: 'elyFpGvqXsOSsvEko6ues2Ua4No1_HxaKH_0rUaFuYiX9',
  showCopyAction: true
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

import { InputReadonly } from '#ui/forms/InputReadonly'
import { type ComponentMeta, type ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof InputReadonly> = {
  title: 'Forms/InputReadonly',
  component: InputReadonly,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputReadonly> = (args) => {
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
  value: 'asd6as78d6asds',
  showCopyAction: true
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

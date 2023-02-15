import { Input } from '#core-app-elements/forms/Input'
import { Container } from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Input> = (args) => {
  return (
    <Container minHeight={false}>
      <Input {...args} value={args.value} type={args.type} />
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {
  value: 'I love Commerce Layer',
  type: 'text'
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Your name'
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Your name',
  hint: {
    text: 'Please enter a valid name'
  }
}

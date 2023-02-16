import { InputTextArea } from '#ui/forms/InputTextArea'
import { Container } from '#ui/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof InputTextArea> = {
  title: 'Forms/InputTextArea',
  component: InputTextArea,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputTextArea> = (args) => {
  return (
    <Container minHeight={false}>
      <InputTextArea {...args} value={args.value} />
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Your name',
  name: 'fullname',
  value: 'I love Commerce Layer'
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Your name',
  hint: {
    text: 'Please enter a valid name'
  }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Your name',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}

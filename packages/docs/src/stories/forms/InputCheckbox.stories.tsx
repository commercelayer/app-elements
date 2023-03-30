import { Avatar } from '#ui/atoms/Avatar'
import { Text } from '#ui/atoms/Text'
import { InputCheckbox } from '#ui/forms/InputCheckbox'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof InputCheckbox> = {
  title: 'Forms/InputCheckbox',
  component: InputCheckbox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputCheckbox> = (args) => {
  return <InputCheckbox {...args} />
}

export const Default = Template.bind({})
Default.args = {
  children: 'Click me'
}

export const WithAvatar = Template.bind({})
WithAvatar.args = {
  icon: (
    <Avatar
      size='small'
      shape='circle'
      border='none'
      src='https://ui-avatars.com/api/NY Store/160/101111/FFFFFF/2/0.33/false/true/true'
      alt='market'
      key='avatar'
    />
  ),
  children: (
    <Text key='text' weight='semibold'>
      NY Store
    </Text>
  )
}

export const WithError = Template.bind({})
WithError.args = {
  ...WithAvatar.args,
  disabled: true,
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}

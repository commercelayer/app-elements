import { Avatar } from '#ui/atoms/Avatar'
import { Text } from '#ui/atoms/Text'
import { InputCheckbox } from '#ui/forms/InputCheckbox'
import { ListItem } from '#ui/composite/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputCheckbox> = {
  title: 'Forms/InputCheckbox',
  component: InputCheckbox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputCheckbox> = (args) => {
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

export const WithListItem = Template.bind({})
WithListItem.args = {
  icon: (
    <Avatar
      size='small'
      shape='circle'
      border='none'
      src='carriers:dhl'
      alt='DHL'
    />
  ),
  children: (
    <ListItem tag='div' alignItems='top' borderStyle='none' padding='none'>
      <div>
        <Text size='regular' weight='bold'>
          Express Easy
        </Text>
        <Text size='small' tag='div' variant='info' weight='medium'>
          DHL Express
        </Text>
      </div>
      <Text size='regular' weight='bold'>
        €37,61
      </Text>
    </ListItem>
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

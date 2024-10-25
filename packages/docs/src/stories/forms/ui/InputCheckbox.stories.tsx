import { Avatar } from '#ui/atoms/Avatar'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { Input } from '#ui/forms/Input'
import { InputCheckbox } from '#ui/forms/InputCheckbox'
import { InputSelect } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputCheckbox> = {
  title: 'Forms/ui/InputCheckbox',
  component: InputCheckbox,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputCheckbox> = (args) => {
  return <InputCheckbox {...args} />
}

export const Default: StoryFn = () => {
  return (
    <InputCheckbox>
      Click me <b>!!!</b>
    </InputCheckbox>
  )
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

/**
 * By adding the `hideIconOnDesktop` prop, the icon will be hidden on desktop but only visible on mobile viewports.
 */
export const WithAvatarOnlyForMobile = Template.bind({})
WithAvatarOnlyForMobile.args = {
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
  hideIconOnDesktop: true,
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
    <ListItem alignItems='top' borderStyle='none' padding='none'>
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

export const WithCheckedElement: StoryFn<typeof InputCheckbox> = (args) => {
  return (
    <div style={{ height: '300px' }}>
      <InputCheckbox>First checkbox</InputCheckbox>
      <InputCheckbox defaultChecked checkedElement={<Input />}>
        Set a name
      </InputCheckbox>
      <InputCheckbox
        checkedElement={
          <InputSelect
            onSelect={() => {}}
            hint={{ text: 'Select your preferred color.' }}
            initialValues={[
              { label: 'Red', value: 'red' },
              { label: 'Green', value: 'green' },
              { label: 'Blue', value: 'blue' }
            ]}
          />
        }
      >
        Preferred color
      </InputCheckbox>
      <InputCheckbox>Last checkbox</InputCheckbox>
    </div>
  )
}

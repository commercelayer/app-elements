import { A } from '#ui/atoms/A'
import { Avatar } from '#ui/atoms/Avatar'
import { Icon } from '#ui/atoms/Icon'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ListItem } from '#ui/lists/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Composite/CardDialog',
  component: CardDialog,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof CardDialog> = (args): JSX.Element => (
  <CardDialog {...args} />
)
Default.args = {
  title: 'Title #1',
  subtitle: 'subtitle',
  rightContent: 'right',
  icon: undefined,
  onClose: () => {
    alert('close clicked')
  },
  children: <Spacer top='4'>Content goes here!</Spacer>
}

export const Parcel: StoryFn<typeof CardDialog> = (args): JSX.Element => (
  <CardDialog {...args} />
)
Parcel.args = {
  title: 'Large Box #1',
  icon: <Icon name='package' gap='large' background='teal' />,
  onClose: () => {
    alert('clicked')
  },
  children: (
    <div>
      <ListItem
        tag='div'
        gutter='none'
        icon={
          <Avatar
            size='small'
            alt='White Men T-shirt with Pink Logo (M)'
            src='https://img.commercelayer.io/skus/TSHIRTMMFFFFFFE63E74.png?fm=jpg&q=90'
          />
        }
      >
        <div>
          <Text size='small' tag='div' variant='info' weight='medium'>
            TSHIRTMMFFFFFFE63E74MXXX
          </Text>
          <Text tag='div' weight='bold'>
            White Men T-shirt with Pink Logo (M)
          </Text>
        </div>
        <div>
          <Text size='small' tag='div' variant='info' weight='medium'>
            &nbsp;
          </Text>
          <Text tag='div' variant='info' weight='bold' wrap='nowrap'>
            x 1
          </Text>
        </div>
      </ListItem>
      <ListItem
        tag='div'
        gutter='none'
        icon={
          <Avatar
            size='small'
            alt='White Men T-shirt with Pink Logo (M)'
            src='https://img.commercelayer.io/skus/TSHIRTMMFFFFFFE63E74.png?fm=jpg&q=90'
          />
        }
      >
        <div>
          <Text size='small' tag='div' variant='info' weight='medium'>
            TSHIRTMMFFFFFFE63E74LXXX
          </Text>
          <Text tag='div' weight='bold'>
            White Men T-shirt with Pink Logo (L)
          </Text>
        </div>
        <div>
          <Text size='small' tag='div' variant='info' weight='medium'>
            &nbsp;
          </Text>
          <Text tag='div' variant='info' weight='bold' wrap='nowrap'>
            x 2
          </Text>
        </div>
      </ListItem>
      <Spacer top='4'>
        <ListDetailsItem
          label='Total'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          3 items
        </ListDetailsItem>
        <ListDetailsItem
          label='Weight'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          300 gr
        </ListDetailsItem>
      </Spacer>
    </div>
  )
}

export const Carrier: StoryFn<typeof CardDialog> = (args): JSX.Element => (
  <CardDialog {...args} />
)
Carrier.args = {
  title: 'Express Easy',
  subtitle: 'DHL express',
  rightContent: (
    <Text size='regular' weight='bold'>
      $29
    </Text>
  ),
  icon: <Icon name='cloud' gap='large' background='gray' />,
  onClose: undefined,
  children: (
    <Spacer top='4'>
      <ListDetailsItem
        label='Status'
        childrenAlign='right'
        border='none'
        gutter='none'
      >
        <A>In transit</A>
      </ListDetailsItem>
      <ListDetailsItem
        label='Tracking'
        childrenAlign='right'
        border='none'
        gutter='none'
      >
        42314321ASD4545
      </ListDetailsItem>
      <ListDetailsItem
        label='Estimated delivery'
        childrenAlign='right'
        border='none'
        gutter='none'
      >
        May 17, 2023 12:00 AM
      </ListDetailsItem>
    </Spacer>
  )
}

export const NoChildren: StoryFn<typeof CardDialog> = (args): JSX.Element => (
  <CardDialog {...args} />
)
NoChildren.args = {
  title: 'Express Easy',
  subtitle: 'DHL express',
  rightContent: (
    <Text size='regular' weight='bold'>
      $29
    </Text>
  ),
  icon: <Icon name='cloud' gap='large' background='gray' />,
  onClose: undefined
}

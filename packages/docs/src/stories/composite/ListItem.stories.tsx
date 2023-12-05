import { Avatar } from '#ui/atoms/Avatar'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListItem> = {
  title: 'Composite/ListItem',
  component: ListItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Simple: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <Text weight='bold'>Skus</Text>
    <StatusIcon name='caretRight' />
  </ListItem>
)
Simple.args = {
  onClick: () => {
    alert('clicked')
  }
}

const WithIconTemplate: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <div>
      <Text tag='div' weight='semibold'>
        NY Store #19346524
      </Text>
      <Text tag='div' weight='medium' size='small' variant='info'>
        Placed · mjordan@nba.com · May 17
      </Text>
      <Text tag='div' weight='bold' size='small' variant='warning'>
        Awaiting approval
      </Text>
    </div>
    <div>
      <Text tag='div' weight='semibold'>
        $42.55
      </Text>
      <Text tag='div' weight='medium' size='small' variant='info'>
        Authorized
      </Text>
    </div>
  </ListItem>
)

export const WithIcon = WithIconTemplate.bind({})
WithIcon.args = {
  tag: 'div',
  icon: <StatusIcon name='arrowDown' background='orange' gap='large' />
}

export const WithCenteredIcon = WithIconTemplate.bind({})
WithCenteredIcon.args = {
  tag: 'div',
  icon: <StatusIcon name='arrowDown' background='orange' gap='large' />,
  alignIcon: 'center'
}

export const AsAnchor = WithIconTemplate.bind({})
AsAnchor.args = {
  tag: 'a',
  href: 'https://www.commercelayer.io',
  target: '_blank',
  icon: <StatusIcon name='arrowDown' background='orange' gap='large' />
}

export const OrderLine: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <div>
      <Text size='small' weight='medium' variant='info' tag='div'>
        SKU 543289
      </Text>
      <Text tag='div' weight='bold'>
        Black Baby Short Sleeve with pink logo 12 months size XL
      </Text>
    </div>
    <Text weight='medium' variant='info' tag='div' wrap='nowrap'>
      $69,50 x 2
    </Text>
    <Text weight='bold' tag='div' wrap='nowrap'>
      $139,00
    </Text>
  </ListItem>
)
OrderLine.args = {
  padding: 'y',
  borderStyle: 'dashed',
  icon: (
    <Avatar
      src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png'
      alt='Black Hat'
    />
  )
}

export const Task: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args} icon={<RadialProgress percentage={45} />}>
    <div>
      <Text tag='div' weight='semibold'>
        Prices
      </Text>
      <Text tag='div' size='small' variant='info' weight='medium'>
        Importing 35%
      </Text>
    </div>
    <StatusIcon name='caretRight' />
  </ListItem>
)

export const Pending: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args} icon={<RadialProgress icon='cloud' />}>
    <div>
      <Text tag='div' weight='semibold'>
        Prices
      </Text>
      <Text tag='div' size='small' variant='info' weight='medium'>
        Importing 35%
      </Text>
    </div>
    <StatusIcon name='caretRight' />
  </ListItem>
)

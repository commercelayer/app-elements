import { Text } from '#app-elements/atoms/Text'
import { ListItem } from '#app-elements/lists/ListItem'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { RadialProgress } from '#app-elements/atoms/RadialProgress'
import { Icon } from '#app-elements/atoms/Icon'
import { Avatar } from '#app-elements/atoms/Avatar'

const setup: ComponentMeta<typeof ListItem> = {
  title: 'Lists/ListItem',
  component: ListItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Simple: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <Text weight='bold'>Skus</Text>
    <Icon name='caretRight' />
  </ListItem>
)
Simple.args = {
  onClick: () => {
    alert('clicked')
  }
}

export const WithIcon: ComponentStory<typeof ListItem> = (args) => (
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
WithIcon.args = {
  onClick: () => undefined,
  icon: <Icon name='arrowDown' background='orange' gap='large' />
}

export const OrderLine: ComponentStory<typeof ListItem> = (args) => (
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
    <Text weight='bold' tag='div'>
      $139,00
    </Text>
  </ListItem>
)
OrderLine.args = {
  gutter: 'none',
  borderStyle: 'dashed',
  icon: (
    <Avatar
      src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png'
      alt='Black Hat'
    />
  )
}

export const Task: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args} icon={<RadialProgress percentage={45} />}>
    <div>
      <Text tag='div' weight='semibold'>
        Prices
      </Text>
      <Text tag='div' size='small' variant='info' weight='medium'>
        Importing 35%
      </Text>
    </div>
    <Icon name='caretRight' />
  </ListItem>
)

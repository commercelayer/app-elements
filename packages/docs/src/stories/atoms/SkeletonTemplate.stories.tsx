import { Avatar } from '#app-elements/atoms/Avatar'
import { Badge } from '#app-elements/atoms/Badge'
import { Button } from '#app-elements/atoms/Button'
import { Icon } from '#app-elements/atoms/Icon'
import { RadialProgress } from '#app-elements/atoms/RadialProgress'
import { Text } from '#app-elements/atoms/Text'
import { ListItem } from '#app-elements/lists/ListItem'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof SkeletonTemplate> = {
  title: 'Atoms/SkeletonTemplate',
  component: SkeletonTemplate,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const children = (
  <div>
    <ListItem
      borderStyle='dashed'
      icon={
        <Avatar
          alt='Commerce Layer'
          src='https://ui-avatars.com/api/Commerce+Layer/160/101111/FFFFFF/2/0.33/false/true/true'
          shape='circle'
          border='none'
        />
      }
    >
      <Icon name='check' background='green' gap='large' />
      <RadialProgress percentage={42} />
    </ListItem>
    <ListItem borderStyle='dashed'>
      <div>
        <Text tag='div'>Ehi there!</Text>
        <Badge label='APPROVED' variant='primary' />
      </div>
      <Button>OK</Button>
    </ListItem>
    <Spacer top='8'>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce diam
        odio, aliquet eget nulla id, imperdiet dignissim libero. Nunc vulputate
        dolor vitae est interdum congue. In non ante lorem. Sed vel sem at felis
        euismod tempor. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia curae; Sed sagittis, ligula at faucibus
        vestibulum, turpis eros ultrices nisl, in consequat arcu est feugiat
        nisi. Proin cursus dolor sed arcu efficitur efficitur. Pellentesque quis
        tortor leo. Proin non ligula metus. Praesent eget sem felis. Donec porta
        pellentesque lorem tempor dictum. Phasellus rhoncus tortor eros, sit
        amet consectetur elit ullamcorper ac. Aliquam suscipit maximus mauris,
        quis ultricies nisl sollicitudin tempus. Ut ut tempus nisi. Proin
        fermentum consectetur lacus id condimentum.
      </Text>
    </Spacer>
  </div>
)

const Template: ComponentStory<typeof SkeletonTemplate> = ({
  children,
  ...args
}) => (
  <div className='flex gap-2'>
    {children}
    <SkeletonTemplate {...args}>{children}</SkeletonTemplate>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  children
}

export const WithRenderDelay = Template.bind({})
WithRenderDelay.args = {
  children,
  delayMs: 3000
}

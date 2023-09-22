import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import {
  SkeletonTemplate,
  withSkeletonTemplate
} from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'
import {
  cloneElement,
  createElement,
  forwardRef,
  isValidElement,
  type ReactNode
} from 'react'

const setup: Meta<typeof SkeletonTemplate> = {
  title: 'Atoms/SkeletonTemplate',
  component: SkeletonTemplate,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const ForwardRefComponent = forwardRef<unknown, { children: ReactNode }>(
  (props, ref) => {
    const { children } = props

    const jsx = isValidElement(children) ? children : createElement('a', props)

    return cloneElement(jsx, {})
  }
)

const WithSkeletonComponentB = withSkeletonTemplate<{ children: ReactNode }>(
  ({ children }) => (
    <WithSkeletonComponentA>B {children}</WithSkeletonComponentA>
  )
)

const WithSkeletonComponentA = withSkeletonTemplate<{ children: ReactNode }>(
  ({ children }) => <div>A {children}</div>
)

const children = (
  <>
    <ForwardRefComponent>
      <a>Simil Wouter</a>
    </ForwardRefComponent>
    <WithSkeletonComponentB>C</WithSkeletonComponentB>
    <ListItem
      tag='div'
      borderStyle='dashed'
      onClick={() => {
        alert('Hello world!')
      }}
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
    <ListItem tag='div' borderStyle='dashed'>
      <div>
        <Text tag='div'>Ehi there!</Text>
        <Badge variant='primary'>APPROVED</Badge>
      </div>
      <Button
        onClick={() => {
          alert('Hello world!')
        }}
      >
        OK
      </Button>
    </ListItem>
    <Spacer top='8'>
      <a href='https://example.com'>It's a link</a>
      <br />
      <div
        onClick={() => {
          alert('Hello world!')
        }}
      >
        It's an onClick
      </div>
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
  </>
)

const Template: StoryFn<typeof SkeletonTemplate> = ({ children, ...args }) => (
  <>
    <div className='flex gap-2 mb-8'>
      <SkeletonTemplate {...args}>
        This content is loading,{' '}
        <SkeletonTemplate isLoading={false}>
          but this content is not!
        </SkeletonTemplate>
      </SkeletonTemplate>
    </div>
    <Spacer bottom='8'>
      <hr />
    </Spacer>
    <div className='flex gap-2'>
      <div>{children}</div>
      <div>
        <SkeletonTemplate {...args}>{children}</SkeletonTemplate>
      </div>
    </div>
  </>
)

export const Default = Template.bind({})
Default.args = {
  children,
  delayMs: 0,
  isLoading: true
}

export const WithRenderDelay = Template.bind({})
WithRenderDelay.args = {
  children,
  isLoading: true,
  delayMs: 3000
}

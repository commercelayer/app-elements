import { Button } from '#ui/atoms/Button'
import { Card } from '#ui/atoms/Card'
import { Icon } from '#ui/atoms/Icon'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card
}
export default setup

const Template: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <p>
      <strong>I am a card</strong>
    </p>
    <p>I am a card content row</p>
    <p>I am a card content row</p>
    <p>I am a card content row</p>
  </Card>
)

export const Default = Template.bind({})
Default.args = {}

/** Card can have a `footer` that renders in dedicated section. */
export const Footer: StoryFn<typeof Card> = (args) => (
  <Card {...args}>I'm the card content</Card>
)
Footer.args = {
  footer: (
    <div className='text-center'>
      <Button variant='link'>
        <Icon gap='small' className='text-2xl mr-1' name='cloud' />{' '}
        <Text size='small'>Download file</Text>
      </Button>
    </div>
  )
}

/** The rounded corner should also be visible when children have a background. */
export const ChildrenWithBackground: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      Item #1
    </ListItem>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      Item #2
    </ListItem>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      Item #3
    </ListItem>
  </Card>
)
ChildrenWithBackground.args = {
  gap: '1'
}

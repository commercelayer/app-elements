import { Card } from '#ui/atoms/Card'
import { ListItem } from '#ui/lists/ListItem'
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

export const WithListItem: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      I'm a clickable listItem
    </ListItem>
  </Card>
)

WithListItem.args = {
  gap: '1'
}

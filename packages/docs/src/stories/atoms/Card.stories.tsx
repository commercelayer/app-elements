import { Card } from '#ui/atoms/Card'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card
}
export default setup

const Template: ComponentStory<typeof Card> = (args) => (
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

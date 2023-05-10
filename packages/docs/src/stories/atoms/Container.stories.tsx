import { Container } from '#ui/atoms/Container'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Container> = {
  title: 'Atoms/Container',
  component: Container,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Container> = (args) => (
  <Container {...args}>I'm a container</Container>
)

export const Default = Template.bind({})

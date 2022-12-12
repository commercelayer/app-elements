import Container from '#core-app-elements/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

// 👇 This default export determines where your story goes in the story list
const setup: ComponentMeta<typeof Container> = {
  title: 'Atoms/Container',
  component: Container,
  parameters: {
    layout: 'padded'
  }
}
export default setup

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args}>I'm a container</Container>
)

export const Default = Template.bind({})

import { Container } from '#ui/atoms/Container'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Container> = {
  title: 'Atoms/Container',
  component: Container,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args}>I'm a container</Container>
)

export const Default = Template.bind({})

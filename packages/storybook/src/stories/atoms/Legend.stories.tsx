import Legend from '#core-app-elements/atoms/Legend'
import A from '#core-app-elements/atoms/A'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Legend> = {
  title: 'Atoms/Legend',
  component: Legend,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Legend> = (args) => (
  <Container minHeight={false}>
    <Legend {...args} actionButton={<A>New export</A>} />
  </Container>
)

export const Default = Template.bind({})
Default.args = {
  title: 'All SKUs'
}

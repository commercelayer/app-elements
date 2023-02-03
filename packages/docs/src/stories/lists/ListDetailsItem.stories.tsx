import ListDetailsItem from '#core-app-elements/lists/ListDetailsItem'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof ListDetailsItem> = {
  title: 'Lists/ListDetailsItem',
  component: ListDetailsItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListDetailsItem> = (args) => (
  <Container minHeight={false}>
    <ListDetailsItem {...args} />
  </Container>
)

export const Default = Template.bind({})
Default.args = {
  label: 'Name',
  isLoading: false,
  children: 'Gray Women Crop Top with Black Logo (M)'
}

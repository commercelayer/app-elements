import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof ListDetailsItem> = {
  title: 'Lists/ListDetailsItem',
  component: ListDetailsItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListDetailsItem> = (args) => (
  <ListDetailsItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Name',
  isLoading: false,
  children: 'Gray Women Crop Top with Black Logo (M)'
}

import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListDetailsItem> = {
  title: 'Lists/ListDetailsItem',
  component: ListDetailsItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ListDetailsItem> = (args) => (
  <ListDetailsItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Name',
  isLoading: false,
  children: 'Gray Women Crop Top with Black Logo (M)'
}

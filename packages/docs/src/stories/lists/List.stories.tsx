import { A } from '#ui/atoms/A'
import { List } from '#ui/lists/List'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof List> = {
  title: 'Lists/List',
  component: List,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof List> = (args) => (
  <List {...args}>
    <div style={{ padding: '2rem' }}>item #1</div>
    <div style={{ padding: '2rem' }}>item #2</div>
    <div style={{ padding: '2rem' }}>...</div>
    <div style={{ padding: '2rem' }}>item #25</div>
  </List>
)

export const WithTitle = Template.bind({})
WithTitle.args = {
  title: 'All items',
  actionButton: <A>New item</A>
}

export const WithPagination = Template.bind({})
WithPagination.args = {
  title: 'All items',
  isLoading: false,
  pagination: {
    recordsPerPage: 25,
    recordCount: 104,
    currentPage: 1,
    onChangePageRequest: (newPage: number) => {},
    pageCount: 5
  }
}

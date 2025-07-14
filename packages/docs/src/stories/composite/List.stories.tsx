import { A } from '#ui/atoms/A'
import { Icon } from '#ui/atoms/Icon'
import { List } from '#ui/composite/List'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof List> = {
  title: 'Composite/List',
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

export const Default = Template.bind({})
Default.args = {
  title: 'All items',
  actionButton: (
    <A
      href='https://commercelayer.io'
      variant='secondary'
      size='mini'
      alignItems='center'
    >
      <Icon name='plus' /> New item
    </A>
  )
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

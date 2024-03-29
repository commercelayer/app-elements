import { Pagination } from '#ui/atoms/Pagination'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof Pagination> = {
  title: 'Atoms/Pagination',
  component: Pagination
}
export default setup

const Template: StoryFn<typeof Pagination> = (args) => <Pagination {...args} />

export const Default = Template.bind({})
Default.args = {
  isDisabled: false,
  currentPage: 1,
  onChangePageRequest: () => {},
  pageCount: 10
}

const TemplateWithFullPageChange: StoryFn<typeof Pagination> = (args) => {
  const [currentPage, setPage] = useState(1)
  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onChangePageRequest={setPage}
      pageCount={30}
    />
  )
}

export const WithFullPageChange = TemplateWithFullPageChange.bind({})
WithFullPageChange.args = {
  isDisabled: false
}

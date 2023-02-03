import Pagination from '#core-app-elements/atoms/Pagination'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof Pagination> = {
  title: 'Atoms/Pagination',
  component: Pagination
}
export default setup

const Template: ComponentStory<typeof Pagination> = (args) => (
  <Pagination {...args} />
)

export const Default = Template.bind({})
Default.args = {
  isDisabled: false,
  currentPage: 1,
  onChangePageRequest: () => {},
  pageCount: 10
}

const TemplateWithFullPageChange: ComponentStory<typeof Pagination> = (
  args
) => {
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

import { PageHeading } from '#ui/atoms/PageHeading'
import { List } from '#ui/lists/List'
import { ListItem } from '#ui/lists/ListItem'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof List> = {
  title: 'Lists/Simple',
  component: List,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof List> = (args) => (
  <List {...args} actionButton={undefined} pagination={undefined}>
    <ListItem label='Customers' />
    <ListItem label='Orders' />
    <ListItem label='Prices' />
    <ListItem label='SKUs' />
    <ListItem label='SKU lists' />
    <ListItem label='Stock items' />
  </List>
)

export const Default = Template.bind({})

const TemplateWithPagination: ComponentStory<typeof List> = (args) => {
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <List
      {...args}
      pagination={{
        recordsPerPage: 20,
        recordCount: 243,
        currentPage,
        onChangePageRequest: (newPage: number) => setCurrentPage(newPage),
        pageCount: 5
      }}
      actionButton={undefined}
    >
      <ListItem label='Customers' />
      <ListItem label='Orders' />
      <ListItem label='Prices' />
      <ListItem
        label='SKU lists'
        icon={<MyIcon />}
        description='June 15, 2022 14:57'
      />
      <ListItem label='Stock items' />
    </List>
  )
}
export const WithPagination = TemplateWithPagination.bind({})
WithPagination.args = {
  title: 'My list'
}

const TemplateFullPage: ComponentStory<typeof List> = (args) => {
  const [page, setPage] = useState(1)
  return (
    <>
      <PageHeading
        title='Resources'
        badgeLabel='TEST-DATA'
        description='Some optional description'
        onGoBack={() => undefined}
      />
      <List
        title='My list'
        pagination={{
          recordsPerPage: 20,
          recordCount: 243,
          currentPage: page,
          onChangePageRequest: (newPage: number) => setPage(newPage),
          pageCount: 5
        }}
      >
        <ListItem label='Customers' description='June 15, 2022 14:57' />
        <ListItem label='Orders' description='June 15, 2022 14:57' />
        <ListItem label='Prices' description='June 15, 2022 14:57' />
        <ListItem label='SKUs' description='June 15, 2022 14:57' />
        <ListItem label='SKU lists' description='June 15, 2022 14:57' />
        <ListItem label='Stock items' description='June 15, 2022 14:57' />
      </List>
    </>
  )
}
export const FullPage = TemplateFullPage.bind({})

function MyIcon(): JSX.Element {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#e6e7e7',
        borderRadius: '100%'
      }}
    />
  )
}

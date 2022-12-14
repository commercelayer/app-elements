import ListSimpleItem from '#core-app-elements/lists/ListSimpleItem'
import ListSimple from '#core-app-elements/lists/ListSimple'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'
import PageHeading from '#core-app-elements/atoms/PageHeading'

const setup: ComponentMeta<typeof ListSimple> = {
  title: 'Lists/ListSimple',
  component: ListSimple,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListSimple> = (args) => (
  <Container>
    <ListSimple>
      <ListSimpleItem label='Customers' />
      <ListSimpleItem label='Orders' />
      <ListSimpleItem label='Prices' />
      <ListSimpleItem label='SKUs' />
      <ListSimpleItem label='SKU lists' />
      <ListSimpleItem label='Stock items' />
    </ListSimple>
  </Container>
)

export const Default = Template.bind({})

const TemplateWithPagination: ComponentStory<typeof ListSimple> = (args) => {
  const [page, setPage] = useState(1)
  return (
    <Container>
      <ListSimple
        title='My list'
        pagination={{
          recordsPerPage: 20,
          recordCount: 243,
          currentPage: page,
          onChangePageRequest: (newPage) => setPage(newPage),
          pageCount: 5
        }}
      >
        <ListSimpleItem label='Customers' />
        <ListSimpleItem label='Orders' />
        <ListSimpleItem label='Prices' />
        <ListSimpleItem label='SKU lists' />
        <ListSimpleItem label='Stock items' />
      </ListSimple>
    </Container>
  )
}
export const WithPagination = TemplateWithPagination.bind({})

const TemplateFullPage: ComponentStory<typeof ListSimple> = (args) => {
  const [page, setPage] = useState(1)
  return (
    <Container>
      <PageHeading
        title='Resources'
        badgeLabel='TEST-DATA'
        description='Some optional description'
        onGoBack={() => undefined}
      />
      <ListSimple
        title='My list'
        pagination={{
          recordsPerPage: 20,
          recordCount: 243,
          currentPage: page,
          onChangePageRequest: (newPage) => setPage(newPage),
          pageCount: 5
        }}
      >
        <ListSimpleItem label='Customers' description='June 15, 2022 14:57' />
        <ListSimpleItem label='Orders' description='June 15, 2022 14:57' />
        <ListSimpleItem label='Prices' description='June 15, 2022 14:57' />
        <ListSimpleItem label='SKUs' description='June 15, 2022 14:57' />
        <ListSimpleItem label='SKU lists' description='June 15, 2022 14:57' />
        <ListSimpleItem label='Stock items' description='June 15, 2022 14:57' />
      </ListSimple>
    </Container>
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

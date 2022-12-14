import ListSimpleItem from '#core-app-elements/lists/ListSimpleItem'
import ListSimple from '#core-app-elements/lists/ListSimple'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

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

const TemplateFull: ComponentStory<typeof ListSimple> = (args) => {
  const [page, setPage] = useState(1)
  return (
    <Container>
      <ListSimple
        title='Full example'
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
        <ListSimpleItem
          label='SKUs'
          description='June 15, 2022 14:57'
          icon={<MyIcon />}
        />
        <ListSimpleItem label='SKU lists' />
        <ListSimpleItem label='Stock items' />
      </ListSimple>
    </Container>
  )
}

export const Full = TemplateFull.bind({})

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

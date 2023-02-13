import { List } from '#core-app-elements/lists/List'
import { ListItemTask } from '#core-app-elements/lists/ListItemTask'
import { Container } from '#core-app-elements/atoms/Container'
import { A } from '#core-app-elements/atoms/A'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof List> = {
  title: 'Lists/Tasks',
  component: List,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof List> = (args) => {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <Container>
      <List
        {...args}
        isDisabled={args.isDisabled}
        title={args.title}
        actionButton={<A>New import</A>}
        pagination={{
          recordsPerPage: 20,
          recordCount: 243,
          currentPage,
          onChangePageRequest: (newPage: number) => setCurrentPage(newPage),
          pageCount: 5
        }}
      >
        <ListItemTask
          status='progress'
          progressPercentage={45}
          title='Prices'
          description='Importing 35%'
        />
        <ListItemTask
          status='pending'
          title='Addresses'
          description='Pending'
        />
        <ListItemTask
          status='success'
          title='Gift cards'
          description={<div>Imported on May 17, 2022</div>}
        />
        <ListItemTask
          status='success'
          title='Customers'
          description={<div>Imported with 3 errors on May 17, 2022 </div>}
        />
        <ListItemTask
          status='danger'
          title='Prices'
          description='Import failed n May 17, 2022'
        />
      </List>
    </Container>
  )
}

export const WithListItemTask = Template.bind({})

WithListItemTask.args = {
  title: 'Imports',
  isDisabled: false,
  isLoading: false
}

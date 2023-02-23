import { A } from '#ui/atoms/A'
import { List } from '#ui/lists/List'
import { ListItemTask } from '#ui/lists/ListItemTask'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Text } from '#ui/atoms/Text'
import { ListItemFlex } from '#ui/lists/ListItemFlex'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Icon } from '#ui/atoms/Icon'

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

      <ListItemFlex icon={<StatusIcon status='progress' percentage={45} />}>
        <div>
          <Text tag='div' weight='semibold'>
            Prices
          </Text>
          <Text tag='div' size='small' variant='info' weight='medium'>
            Importing 35%
          </Text>
        </div>
        <Icon name='caretRight' />
      </ListItemFlex>

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
  )
}

export const WithListItemTask = Template.bind({})

WithListItemTask.args = {
  title: 'Imports',
  isDisabled: false,
  isLoading: false
}

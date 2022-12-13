import ListTask from '#core-app-elements/lists/ListTask'
import ListTaskItem from '#core-app-elements/lists/ListTaskItem'
import Container from '#core-app-elements/atoms/Container'
import A from '#core-app-elements/atoms/A'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof ListTask> = {
  title: 'Lists/ListTask',
  component: ListTask,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListTask> = (args) => (
  <Container>
    <ListTask
      {...args}
      isDisabled={args.isDisabled}
      title={args.title}
      actionButton={<A>New import</A>}
      pagination={{
        recordsPerPage: 20,
        recordCount: 243,
        currentPage: 1,
        onChangePageRequest: () => undefined,
        pageCount: 5
      }}
    >
      <ListTaskItem
        status='progress'
        progressPercentage={45}
        title='Prices'
        description='Importing 35%'
      />
      <ListTaskItem status='pending' title='Addresses' description='Pending' />
      <ListTaskItem
        status='success'
        title='Gift cards'
        description={<div>Imported on May 17, 2022</div>}
      />
      <ListTaskItem
        status='success'
        title='Customers'
        description={<div>Imported with 3 errors on May 17, 2022 </div>}
      />
      <ListTaskItem
        status='danger'
        title='Prices'
        description='Import failed n May 17, 2022'
      />
    </ListTask>
  </Container>
)

export const Primary = Template.bind({})

Primary.args = {
  title: 'Imports'
}

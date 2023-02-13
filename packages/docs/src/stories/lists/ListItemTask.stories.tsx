import { ListItemTask } from '#core-app-elements/lists/ListItemTask'
import { Legend } from '#core-app-elements/atoms/Legend'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof ListItemTask> = {
  title: 'Lists/ListItemTask',
  component: ListItemTask,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListItemTask> = (args) => (
  <ListItemTask
    {...args}
    progressPercentage={
      args.status === 'progress' && args.progressPercentage == null
        ? 50
        : args.progressPercentage
    }
  />
)

export const Success = Template.bind({})
Success.args = {
  title: 'Prices',
  status: 'success',
  description: 'Exported on May 17, 2022',
  onCancelRequest: undefined
}

export const Progress = Template.bind({})
Progress.args = {
  title: 'Orders',
  status: 'progress',
  progressPercentage: 23,
  description: 'Exporting 23%',
  onCancelRequest: () => undefined
}

const TemplateMultiple: ComponentStory<typeof ListItemTask> = (args) => (
  <div>
    <Legend title='Sample list' />
    {/* tip: wrap items in a <List> component to properly set a border top on the first item  */}
    <ListItemTask
      title='Orders'
      status='progress'
      progressPercentage={23}
      description='Exporting 23%'
      onCancelRequest={() => undefined}
    />
    <ListItemTask
      title='Prices'
      status='success'
      description='Exported on May 17, 2022'
    />
  </div>
)

export const MultipleItems = TemplateMultiple.bind({})

import ListTaskItem from '#core-app-elements/lists/ListTaskItem'
import Legend from '#core-app-elements/atoms/Legend'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof ListTaskItem> = {
  title: 'Lists/ListTaskItem',
  component: ListTaskItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListTaskItem> = (args) => (
  <ListTaskItem
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

const TemplateMultiple: ComponentStory<typeof ListTaskItem> = (args) => (
  <div>
    <Legend title='Sample list' />
    <ListTaskItem
      title='Orders'
      status='progress'
      progressPercentage={23}
      description='Exporting 23%'
      onCancelRequest={() => undefined}
    />
    <ListTaskItem
      title='Prices'
      status='success'
      description='Exported on May 17, 2022'
    />
  </div>
)

export const MultipleItems = TemplateMultiple.bind({})

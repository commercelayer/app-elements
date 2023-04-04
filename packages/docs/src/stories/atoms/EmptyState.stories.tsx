import { A } from '#ui/atoms/A'
import { Button } from '#ui/atoms/Button'
import { EmptyState } from '#ui/atoms/EmptyState'
import { type ComponentMeta, type ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof EmptyState> = (args) => (
  <EmptyState {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'No imports yet!',
  description: 'Create your first import',
  action: <Button variant='primary'>New import</Button>
}

const TemplateWithIcon: ComponentStory<typeof EmptyState> = (args) => (
  <EmptyState {...args} />
)
export const WithIcon = TemplateWithIcon.bind({})
WithIcon.args = {
  title: 'No adjustment yet!',
  description: (
    <>
      Add a adjustment with the API, or use the CLI. <A>View API reference.</A>
    </>
  ),
  icon: 'stack'
}
export const WithAction = TemplateWithIcon.bind({})
WithAction.args = {
  title: 'No exports yet!',
  description: 'Create your first export',
  icon: 'download',
  action: <Button variant='primary'>Create new</Button>
}

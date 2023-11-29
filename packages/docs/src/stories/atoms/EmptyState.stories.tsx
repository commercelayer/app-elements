import { A } from '#ui/atoms/A'
import { Button } from '#ui/atoms/Button'
import { EmptyState } from '#ui/atoms/EmptyState'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof EmptyState> = (args) => <EmptyState {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'No imports yet!',
  description: 'Create your first import',
  action: <Button variant='primary'>New import</Button>
}

const TemplateWithIcon: StoryFn<typeof EmptyState> = (args) => (
  <EmptyState {...args} />
)
export const WithIcon = TemplateWithIcon.bind({})
WithIcon.args = {
  title: 'No adjustment yet!',
  description: (
    <>
      Add a adjustment with the API, or use the CLI.{' '}
      <A href='https://docs.commercelayer.io/core/v/api-reference/adjustments/object'>
        View API reference.
      </A>
    </>
  ),
  icon: 'resources'
}
export const WithAction = TemplateWithIcon.bind({})
WithAction.args = {
  title: 'No exports yet!',
  description: 'Create your first export',
  icon: 'download',
  action: <Button variant='primary'>Create new</Button>
}

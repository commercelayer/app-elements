import { Progress } from '#ui/atoms/Progress'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>40%</Progress>
)
Default.args = {
  max: 100,
  value: 40
}

/** If there is no `value` prop, the progress bar is indeterminate; this indicates that an activity is ongoing with no indication of how long it is expected to take. */
export const Indeterminate: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>Loading...</Progress>
)
Indeterminate.args = {}

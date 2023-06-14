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

export const Indeterminate: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>Loading...</Progress>
)
Indeterminate.args = {}

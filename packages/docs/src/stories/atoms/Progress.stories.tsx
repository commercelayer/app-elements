import type { Meta, StoryFn } from "@storybook/react-vite"
import { Progress } from "#ui/atoms/Progress"

const setup: Meta<typeof Progress> = {
  title: "Atoms/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
  },
}
export default setup

export const Default: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>40%</Progress>
)
Default.args = {
  max: 100,
  value: 40,
}

/** If there is no `value` prop, the progress bar is indeterminate; this indicates that an activity is ongoing with no indication of how long it is expected to take. */
export const Indeterminate: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>Loading...</Progress>
)
Indeterminate.args = {}

/** Display completion percentage using `displayMode` prop */
export const WithPercentage: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>40%</Progress>
)
WithPercentage.args = {
  max: 100,
  value: 40,
  displayMode: "percentage",
}

/** Only show the progress bar, without completion details */
export const OnlyBar: StoryFn<typeof Progress> = (args) => (
  <Progress {...args}>40%</Progress>
)
OnlyBar.args = {
  max: 100,
  value: 40,
  displayMode: "none",
}

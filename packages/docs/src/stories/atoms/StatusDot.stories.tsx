import type { Meta, StoryFn } from "@storybook/react-vite"
import { StatusDot } from "#ui/atoms/StatusDot"

const setup: Meta<typeof StatusDot> = {
  title: "Atoms/StatusDot",
  component: StatusDot,
}
export default setup

const Template: StoryFn<typeof StatusDot> = (args) => <StatusDot {...args} />

export const Default = Template.bind({})
Default.args = {
  variant: "success",
}

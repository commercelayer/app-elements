import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageSkeleton } from "#ui/composite/PageSkeleton"

const meta: Meta<typeof PageSkeleton> = {
  title: "Composite/PageSkeleton",
  component: PageSkeleton,
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof PageSkeleton>

export const Default: Story = {
  args: {
    delayMs: 0,
  },
}

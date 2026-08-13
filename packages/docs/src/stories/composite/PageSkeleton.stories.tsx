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

/**
 * Deprecated in favour of `Composite/PageLoading`: the search bar and list of rows
 * drawn here have to be kept in step with every page this stands in for, and they no
 * longer match what the apps render.
 */
export const Default: Story = {
  args: {
    delayMs: 0,
  },
}

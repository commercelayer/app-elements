import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonFilter } from "#ui/atoms/ButtonFilter"

const meta: Meta<typeof ButtonFilter> = {
  title: "Atoms/ButtonFilter",
  component: ButtonFilter,
}

export default meta
type Story = StoryObj<typeof ButtonFilter>

export const Primary: Story = {
  args: {
    label: "Filters · 2",
    onClick: () => {
      alert("main clicked")
    },
    onRemoveRequest: () => {
      alert("remove clicked")
    },
    icon: "funnelSimple",
  },
}

export const NoRemove: Story = {
  args: {
    label: "Filters",
    onClick: () => {
      alert("main clicked")
    },
    onRemoveRequest: undefined,
    icon: "funnelSimple",
  },
}

export const NoIcon: Story = {
  args: {
    label: "NY Store",
    onClick: () => {
      alert("main clicked")
    },
    onRemoveRequest: () => {
      alert("remove clicked")
    },
  },
}

export const Simple: Story = {
  args: {
    label: "Last 7 days",
    onRemoveRequest: undefined,
  },
}

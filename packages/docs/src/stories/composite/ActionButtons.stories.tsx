import type { Meta, StoryObj } from "@storybook/react-vite"
import { ActionButtons } from "#ui/composite/ActionButtons"

const meta: Meta<typeof ActionButtons> = {
  title: "Composite/ActionButtons",
  component: ActionButtons,
  parameters: {
    layout: "padded",
  },
}

export default meta

export const Default: StoryObj<typeof ActionButtons> = {
  args: {
    actions: [
      {
        label: "Approve",
        onClick: () => {
          alert("Approved!")
        },
      },
      {
        label: "Cancel",
        variant: "secondary",
        onClick: () => {
          alert("Cancelled!")
        },
      },
    ],
  },
}

export const OneAction: StoryObj<typeof ActionButtons> = {
  args: {
    actions: [
      {
        label: "Approve",
        onClick: () => {
          alert("Approved!")
        },
      },
    ],
  },
}

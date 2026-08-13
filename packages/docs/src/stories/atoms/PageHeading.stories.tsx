import type { Meta, StoryFn } from "@storybook/react-vite"
import { PageHeading } from "#ui/atoms/PageHeading"

const setup: Meta<typeof PageHeading> = {
  title: "Atoms/PageHeading",
  component: PageHeading,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof PageHeading> = (args) => (
  <PageHeading
    {...args}
    toolbar={{
      buttons: [
        {
          label: "Edit",
          variant: "primary",
          size: "small",
        },
      ],
    }}
  />
)

export const Default = Template.bind({})
Default.args = {
  title: "Resources",
  description: "Lorem ipsum dolor sit",
}

export const WithBadge = Template.bind({})
WithBadge.args = {
  title: "Resources",
  badge: {
    label: "TEST DATA",
  },
  description: "Lorem ipsum dolor sit",
}

export const WithNavGoBack = Template.bind({})
WithNavGoBack.args = {
  title: "Order details",
  description: "Lorem ipsum dolor sit",
  navigationButton: {
    label: "All orders",
    onClick: () => {
      historyGoBack()
    },
  },
}

export const WithNavClose = Template.bind({})
WithNavClose.args = {
  title: "SKUs",
  description: "Lorem ipsum dolor sit",
  navigationButton: {
    label: "Close",
    onClick: () => {
      historyGoBack()
    },
    icon: "x",
  },
}

/**
 * A drawer closes itself rather than navigating back, so its navigation button is
 * rendered as a standalone square button with no label: `variant: 'button'` plus an
 * empty `label`. Icon-only, it gets the very same box as the icon-only buttons of
 * the toolbar sitting next to it.
 */
export const WithNavCloseAsButton: StoryFn<typeof PageHeading> = () => (
  <PageHeading
    title="SKU"
    // the drawer's own padding is the whole gap above the button
    gap="none"
    navigationButton={{
      label: "",
      icon: "x",
      variant: "button",
      onClick: () => {
        historyGoBack()
      },
    }}
    toolbar={{
      buttons: [
        {
          icon: "eye",
          variant: "secondary",
          size: "small",
        },
      ],
    }}
  />
)

export const WithNavAndBadge = Template.bind({})
WithNavAndBadge.args = {
  title: "SKUs",
  badge: {
    label: "TEST DATA",
  },
  navigationButton: {
    label: "Back",
    onClick: () => {
      historyGoBack()
    },
  },
}

function historyGoBack(): undefined {
  return undefined
}

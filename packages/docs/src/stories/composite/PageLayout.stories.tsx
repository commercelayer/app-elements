import type { Meta, StoryFn } from "@storybook/react-vite"
import { Alert } from "#ui/atoms/Alert"
import { Card } from "#ui/atoms/Card"
import { Section } from "#ui/atoms/Section"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { PageLayout } from "#ui/composite/PageLayout"
import { SearchBar } from "#ui/composite/SearchBar"

const setup: Meta<typeof PageLayout> = {
  title: "Composite/PageLayout",
  component: PageLayout,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof PageLayout> = (args) => (
  <PageLayout {...args}>{args.children ?? "Page content here..."}</PageLayout>
)

export const Default = Template.bind({})
Default.args = {
  title: "Resources",
  description: "View all resources",
  navigationButton: {
    label: "Back to dashboard",
    onClick: () => undefined,
  },
  mode: "test",
}

export const WithSimpleToolbar = Template.bind({})
WithSimpleToolbar.args = {
  title: "Resources",
  gap: "none",
  toolbar: {
    buttons: [
      {
        label: "Add new",
        icon: "plus",
        size: "small",
        variant: "primary",
        onClick: () => {
          alert("Add new clicked!")
        },
      },
      {
        label: "Search",
        icon: "plus",
        size: "small",
        variant: "primary",
        onClick: () => {
          alert("Search clicked!")
        },
      },
      {
        label: "Delete",
        icon: "trash",
        size: "small",
        variant: "secondary",
        onClick: () => {
          alert("Add new clicked!")
        },
      },
    ],
  },
  children: (
    <div className="mt-4 mb-14">
      <SearchBar
        placeholder="Cerca..."
        isLoading={false}
        initialValue=""
        onSearch={() => {}}
      />
    </div>
  ),
}

export const WithToolbar = Template.bind({})
WithToolbar.args = {
  title: "Resources",
  description: "View all resources",
  navigationButton: {
    label: "Close",
    onClick: () => undefined,
    icon: "x",
  },
  mode: "live",
  toolbar: {
    buttons: [
      {
        label: "Add new",
        icon: "plus",
        size: "small",
        onClick: () => {
          alert("Add new clicked!")
        },
      },
      {
        label: "Secondary",
        icon: "pulse",
        variant: "secondary",
        size: "small",
        onClick: () => {
          alert("Secondary clicked!")
        },
      },
    ],
    dropdownItems: [
      [
        {
          label: "Edit",
          onClick: () => {
            alert("Edit clicked!")
          },
        },
        {
          label: "Set metadata",
          onClick: () => {
            alert("Set metadata clicked!")
          },
        },
      ],
      [
        {
          label: "Delete",
          onClick: () => {
            alert("Delete clicked!")
          },
        },
      ],
    ],
  },
}

export const WithoutNavigationButton = Template.bind({})
WithoutNavigationButton.args = {
  ...WithToolbar.args,
  navigationButton: undefined,
}

export const MobileWidthWithLongTitle = Template.bind({})
MobileWidthWithLongTitle.args = {
  title: "welcome@commercelayer.io",
  description: "This long title should break thanks to `break-words` className",
  navigationButton: {
    label: "Close",
    onClick: () => undefined,
    icon: "x",
  },
  mode: "live",
  toolbar: {
    buttons: [
      {
        label: "Edit",
        size: "small",
      },
    ],
  },
}
MobileWidthWithLongTitle.decorators = [
  (Story) => (
    <div
      style={{
        maxWidth: "320px",
      }}
    >
      <Story />
    </div>
  ),
]

/**
 * `alert` is for what is true of the resource as a whole rather than of one
 * section, so it is read before anything else on the page.
 */
export const WithAlert = Template.bind({})
WithAlert.args = {
  title: "Promotion",
  description: "Created on May 16, 2025",
  navigationButton: {
    label: "",
    icon: "arrowLeft",
    variant: "button",
    onClick: () => undefined,
  },
  alert: (
    <Alert status="info">
      This promotion is generated via API. Ask developers for details. If issues
      arise, just disable it.
    </Alert>
  ),
  children: (
    <Spacer top="14">
      <Card overflow="visible">Page content here...</Card>
    </Spacer>
  ),
}

/**
 * The slot spans the sidebar column too: the notice is about the page, not about
 * its main column. Pass several `Alert`s and the spacing between them stays the
 * layout's business.
 */
export const WithAlertAndSidebar = Template.bind({})
WithAlertAndSidebar.args = {
  title: "Subscription #1234",
  description: "Created on May 16, 2025",
  fullWidth: true,
  gap: "only-top",
  navigationButton: {
    label: "",
    icon: "arrowLeft",
    variant: "button",
    onClick: () => undefined,
  },
  alert: (
    <Alert status="warning">
      This subscription is <b>pending</b> because it has no usable payment
      method for renewals.
    </Alert>
  ),
  sidebar: (
    <Section title="Customer" titleSize="small">
      <Text variant="info">customer@commercelayer.io</Text>
    </Section>
  ),
  children: (
    <Spacer top="14">
      <Card overflow="visible">
        Main content, beside the sidebar from `lg` up.
      </Card>
    </Spacer>
  ),
}

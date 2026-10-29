import type { Meta, StoryFn } from "@storybook/react-vite"
import { A } from "#ui/atoms/A"
import { Button } from "#ui/atoms/Button"
import { EmptyState } from "#ui/atoms/EmptyState"
import { Icon } from "#ui/atoms/Icon"

const setup: Meta<typeof EmptyState> = {
  title: "Atoms/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof EmptyState> = (args) => <EmptyState {...args} />

export const Default = Template.bind({})
Default.args = {
  title: "No imports yet!",
  description: "Create your first import",
  action: <Button variant="primary">New import</Button>,
}

const TemplateWithIcon: StoryFn<typeof EmptyState> = (args) => (
  <EmptyState {...args} />
)
export const WithIcon = TemplateWithIcon.bind({})
WithIcon.args = {
  title: "No adjustment yet!",
  description: (
    <>
      Add a adjustment with the API, or use the CLI.{" "}
      <A href="https://docs.commercelayer.io/core/v/api-reference/adjustments/object">
        View API reference.
      </A>
    </>
  ),
  icon: "stack",
}
export const WithAction = TemplateWithIcon.bind({})
WithAction.args = {
  title: "No exports yet!",
  description: "Create your first export",
  icon: "download",
  action: <Button variant="primary">Create new</Button>,
}

export const WithLink = TemplateWithIcon.bind({})
WithLink.args = {
  title: "No custom apps yet",
  description:
    "Build tailored views on your orders, shipments and more, right from your dashboard.",
  icon: "cardsThree",
  action: (
    <A
      href="https://commercelayer.github.io/app-elements/?path=/docs/getting-started-custom-apps--docs"
      target="_blank"
      rel="noreferrer"
      variant="secondary"
      size="mini"
      alignItems="center"
    >
      <Icon name="bookOpenText" size={16} /> Learn more
    </A>
  ),
}

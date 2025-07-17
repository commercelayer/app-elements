import type { Meta, StoryFn } from "@storybook/react-vite"
import { Button } from "#ui/atoms/Button"
import { Section } from "#ui/atoms/Section"
import { Spacer } from "#ui/atoms/Spacer"

const setup: Meta<typeof Section> = {
  title: "Atoms/Section",
  component: Section,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof Section> = (args) => (
  <Section {...args}>
    <Spacer top="4">My section content!</Spacer>
  </Section>
)

export const Default = Template.bind({})
Default.args = {
  title: "Addresses",
  actionButton: (
    <Button size="mini" variant="secondary">
      Add
    </Button>
  ),
}

export const SmallerTitle = Template.bind({})
SmallerTitle.args = {
  title: <span>All SKUs</span>,
  titleSize: "small",
  actionButton: (
    <Button size="mini" variant="secondary">
      New SKU
    </Button>
  ),
}

/** Title is optional. If you do not set the title, then this component will render as a `<div>` HTML element. */
export const WithoutTitle = Template.bind({})
WithoutTitle.args = {
  actionButton: (
    <Button size="mini" variant="secondary">
      New export
    </Button>
  ),
}

/** When neither the `title` nor the `actionButton` is defined, the header is not rendered. */
export const WithoutHeader = Template.bind({})
WithoutHeader.args = {}

export const MultipleActions = Template.bind({})
MultipleActions.args = {
  title: <span>All SKUs</span>,
  titleSize: "small",
  actionButton: (
    <>
      <Button size="mini" variant="secondary">
        See all
      </Button>
      <Button size="mini" variant="secondary">
        New SKU
      </Button>
    </>
  ),
}

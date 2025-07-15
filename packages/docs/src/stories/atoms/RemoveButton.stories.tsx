import type { Meta, StoryFn } from "@storybook/react-vite"
import { RemoveButton } from "#ui/atoms/RemoveButton"

const setup: Meta<typeof RemoveButton> = {
  title: "Atoms/RemoveButton",
  component: RemoveButton,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof RemoveButton> = (args) => (
  <div>
    <RemoveButton {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  children: "Remove item",
  onClick: () => {
    alert("You just clicked!")
  },
  disabled: false,
}

/** You can also use the `<RemoveButton>` without specifying any children. */
export const WithoutChildren = Template.bind({})
WithoutChildren.args = {}

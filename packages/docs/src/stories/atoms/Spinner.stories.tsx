import type { Meta, StoryFn } from "@storybook/react-vite"
import { Spinner } from "#ui/atoms/Spinner"

const setup: Meta<typeof Spinner> = {
  title: "Atoms/Spinner",
  component: Spinner,
}
export default setup

const Template: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />

/**
 * The spinner of a wait with no knowable end, the same a loading page shows.
 * Every instance turns in the same phase, so one taking over from another
 * carries on from the same angle.
 */
export const Default = Template.bind({})
Default.args = {}

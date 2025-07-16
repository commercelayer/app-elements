import type { Meta, StoryFn } from "@storybook/react-vite"
import { Tab, Tabs } from "#ui/atoms/Tabs"

const setup: Meta<typeof Tabs> = {
  title: "Atoms/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <Tab name="Filters">
      <div>Content for first tab</div>
    </Tab>
    <Tab name="Custom rules">
      <div>
        <div>
          When keepAlive is false, this content will be re-mounted on tab change
        </div>
        <input
          defaultValue="change me and test keepAlive"
          style={{
            border: "1px solid gray",
            padding: "0.3rem 1rem",
            marginTop: "1rem",
            borderRadius: "5px",
            width: "100%",
          }}
        />
      </div>
    </Tab>
    <Tab name="Results">
      <div>Content for third tab</div>
    </Tab>
  </Tabs>
)

export const Default = Template.bind({})
Default.args = {
  onTabSwitch: (tabIndex) => {
    console.log("switched to tab", tabIndex)
  },
  keepAlive: true,
}

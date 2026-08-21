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

/**
 * `separatorBefore` draws a vertical rule before a tab, to set the tabs that follow
 * apart from the ones before it.
 *
 * Here the first four tabs are the states an order moves through, while the last two
 * are shelves it can be put on — related to the others, but not a further step.
 *
 * The rule is a flex item in the same row as the tabs, so it takes the same gap on
 * either side, and it is skipped when set on the first rendered tab, where there is
 * nothing to separate.
 */
export const WithSeparator: StoryFn<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <Tab name="All">
      <div>Every order</div>
    </Tab>
    <Tab name="Placed">
      <div>Waiting to be approved</div>
    </Tab>
    <Tab name="Approved">
      <div>Approved, not fulfilled yet</div>
    </Tab>
    <Tab name="Fulfilled">
      <div>Nothing left to do</div>
    </Tab>
    <Tab name="Carts" separatorBefore>
      <div>Not placed yet</div>
    </Tab>
    <Tab name="Archived">
      <div>Put away</div>
    </Tab>
  </Tabs>
)

/**
 * On a narrow screen the tab row scrolls sideways rather than wrapping, and fades out
 * at whichever end still has tabs beyond it. Drag the row below to see the hint move
 * from one side to the other.
 *
 * Labels never break: "In progress" stays on one line and the row grows instead.
 */
export const ScrollingOnMobile: StoryFn<typeof Tabs> = (args) => (
  <div style={{ width: 390, border: "1px dashed #ddd", padding: "0 16px" }}>
    <Tabs {...args}>
      <Tab name="All">
        <div>Every order</div>
      </Tab>
      <Tab name="Placed">
        <div>Waiting to be approved</div>
      </Tab>
      <Tab name="Approved">
        <div>Approved, not being fulfilled yet</div>
      </Tab>
      <Tab name="In progress">
        <div>Being fulfilled</div>
      </Tab>
      <Tab name="Fulfilled">
        <div>Nothing left to do</div>
      </Tab>
      <Tab name="Carts" separatorBefore>
        <div>Not placed yet</div>
      </Tab>
      <Tab name="Archived">
        <div>Put away</div>
      </Tab>
    </Tabs>
  </div>
)

import type { Meta, StoryFn } from "@storybook/react-vite"
import { Grid } from "#ui/atoms/Grid"

const meta: Meta<typeof Grid> = {
  title: "Atoms/Grid",
  component: Grid,
  parameters: {
    layout: "padded",
  },
}

export default meta

const Template: StoryFn<typeof Grid> = (args) => <Grid {...args} />

export const Default = Template.bind({})
Default.args = {
  columns: "2",
  children: (
    <>
      <div className="border">grid item #1</div>
      <div className="border">
        <p>grid item #2</p>
        <p>grid item #2 (new line)</p>
      </div>
      <div className="border">grid item #3</div>
      <div className="border">grid item #4</div>
      <div className="border">grid item #5</div>
    </>
  ),
}

/** Vertically align items center */
export const ItemsCenter = Template.bind({})
ItemsCenter.args = {
  columns: "2",
  alignItems: "center",
  children: (
    <>
      <div className="border">
        <p>grid item #1</p>
        <p>grid item #1 (new line)</p>
      </div>
      <div className="border">grid item #2</div>
    </>
  ),
}

/** Vertically align items to the top (start) */
export const ItemsTop = Template.bind({})
ItemsTop.args = {
  columns: "2",
  alignItems: "start",
  children: (
    <>
      <div className="border">
        <p>grid item #1</p>
        <p>grid item #1 (new line)</p>
      </div>
      <div className="border">grid item #2</div>
    </>
  ),
}

/** Vertically align items to the bottom (end) */
export const ItemsBottom = Template.bind({})
ItemsBottom.args = {
  columns: "2",
  alignItems: "end",
  children: (
    <>
      <div className="border">
        <p>grid item #1</p>
        <p>grid item #1 (new line)</p>
      </div>
      <div className="border">grid item #2</div>
    </>
  ),
}

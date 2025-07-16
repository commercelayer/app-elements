import type { Meta, StoryFn } from "@storybook/react-vite"
import { set, sub } from "date-fns"
import { Text } from "#ui/atoms/Text"
import { Timeline } from "#ui/composite/Timeline"

const setup: Meta<typeof Timeline> = {
  title: "Composite/Timeline",
  component: Timeline,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof Timeline> = (args) => <Timeline {...args} />

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  onKeyDown: (e) => {
    if (e.code === "Enter") {
      alert(e.currentTarget.value)
      e.currentTarget.value = ""
    }
  },
  timezone: "Europe/Rome",
  events: [
    {
      date: sub(
        set(new Date(), {
          month: 11,
          date: 29,
          hours: 10,
          minutes: 23,
          seconds: 10,
        }),
        { years: 1 },
      ).toJSON(),
      message: (
        <span>
          Text in two lines.
          <br />I should not see the border on my left
        </span>
      ),
    },
    {
      date: sub(
        set(new Date(), {
          month: 11,
          date: 29,
          hours: 20,
          minutes: 23,
          seconds: 11,
        }),
        { years: 1 },
      ).toJSON(),
      message: (
        <span>
          Text in two lines.
          <br />I should see the border on my left
        </span>
      ),
    },
    {
      date: sub(
        set(new Date(), {
          month: 11,
          date: 29,
          hours: 20,
          minutes: 24,
          seconds: 12,
        }),
        { years: 1 },
      ).toJSON(),
      message: `Placed`,
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        hours: 12,
        minutes: 6,
        seconds: 27,
      }).toJSON(),
      message: "$250,5 authorized on stripe",
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        hours: 12,
        minutes: 15,
        seconds: 0,
      }).toJSON(),
      message: "Capture failed",
      variant: "warning",
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        hours: 12,
        minutes: 23,
        seconds: 28,
      }).toJSON(),
      message: "Approved",
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        hours: 12,
        minutes: 24,
        seconds: 29,
      }).toJSON(),
      message: "$250,50 captured on stripe",
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        hours: 6,
        minutes: 6,
        seconds: 20,
      }).toJSON(),
      message: "Fulfillment in progress",
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        hours: 8,
        minutes: 8,
        seconds: 35,
      }).toJSON(),
      author: "S. Jennigs",
      message: "left a note",
      note: "Customer would like to receive parcel sooner, please request the customer phone number.",
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        hours: 7,
        minutes: 8,
        seconds: 36,
      }).toJSON(),
      author: "S. Jennigs",
      message: "left a note",
      note: "Short text.",
    },
    {
      date: new Date().toJSON(),
      message: "Fullfilled",
    },
  ],
}

export const Empty = Template.bind({})
Empty.args = {
  events: [],
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true,
  events: [
    {
      date: sub(
        set(new Date(), {
          month: 11,
          date: 29,
          hours: 20,
          minutes: 23,
          seconds: 12,
        }),
        { years: 1 },
      ).toJSON(),
      message: (
        <span>
          <Text weight="bold">M. Jordan</Text> placed this order · 23:12
        </span>
      ),
    },
  ],
}

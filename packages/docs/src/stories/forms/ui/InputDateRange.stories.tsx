import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { InputDateRange } from "#ui/forms/InputDateRange"

const setup: Meta<typeof InputDateRange> = {
  title: "Forms/ui/InputDateRange",
  component: InputDateRange,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: "300px",
        }}
      >
        <Story />
      </div>
    ),
  ],
}
export default setup

const Template: StoryFn<typeof InputDateRange> = (args) => {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  return (
    <InputDateRange
      {...args}
      value={[fromDate, toDate]}
      onChange={([from, to]) => {
        setFromDate(from)
        setToDate(to)
      }}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  label: "Date range",
  fromPlaceholder: "Start date...",
  toPlaceholder: "End date...",
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: "Date range",
  fromPlaceholder: "Start date...",
  hint: { text: "Please enter a valid date range" },
}

/**
 * When passing specific labels for the two fields (from and to), the component will be rendered without the middle arrow icon.
 * And each field will have its own label.
 */
export const WithIndividualLabels = Template.bind({})
WithIndividualLabels.args = {
  fromLabel: "Start date",
  fromHint: { text: "Please enter the start date" },
  toLabel: "End date",
  toHint: { text: "Please enter the end date" },
}

export const WithIndividualErrors = Template.bind({})
WithIndividualErrors.args = {
  fromLabel: "Start date",
  toLabel: "End date",
  fromFeedback: { message: "Invalid start date", variant: "danger" },
  toFeedback: { message: "Invalid end date", variant: "danger" },
}

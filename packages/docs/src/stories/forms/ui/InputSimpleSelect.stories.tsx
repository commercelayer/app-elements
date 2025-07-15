import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { Section } from "#ui/atoms/Section"
import { ListItem } from "#ui/composite/ListItem"
import { InputSimpleSelect } from "#ui/forms/InputSimpleSelect"

const setup: Meta<typeof InputSimpleSelect> = {
  title: "Forms/ui/InputSimpleSelect",
  component: InputSimpleSelect,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof InputSimpleSelect> = (args) => {
  const [value, setValue] = useState(args.value ?? "json")
  return (
    <InputSimpleSelect
      {...args}
      value={value}
      onChange={(e) => {
        setValue(e.currentTarget.value)
      }}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  name: "export-format-default",
  label: "Export format",
  value: "json",
  options: [
    { label: "JSON", value: "json" },
    {
      label: "CSV",
      value: "csv",
    },
  ],
}

export const WithHint = Template.bind({})
WithHint.args = {
  name: "export-format-with-hint",
  label: "Export format",
  hint: {
    text: "Select a format",
  },
  options: Default.args.options,
  value: "csv",
}

export const WithError = Template.bind({})
WithError.args = {
  name: "export-format-with-error",
  label: "Export format",
  options: Default.args.options,
  feedback: {
    variant: "danger",
    message: "You do not have enough permission",
  },
  hint: {
    text: "Select a format",
  },
}

export const Row = Template.bind({})
Row.args = {
  name: "export-format-row",
  label: "Export format",
  options: Default.args.options,
  inline: true,
  hint: {
    text: "Select a format",
  },
}

export const DefaultValue = Template.bind({})
DefaultValue.args = {
  name: "export-format-default-value",
  label: "Export format",
  options: Default.args.options,
  value: "csv",
}

export const WithoutLabel = Template.bind({})
WithoutLabel.args = {
  name: "export-format-without-label",
  options: Default.args.options,
}

export const WithinAListItem: StoryFn = () => {
  return (
    <Section title="More options" titleSize="small">
      <ListItem>
        <InputSimpleSelect
          options={Default.args?.options ?? []}
          name="export-format"
          label="Export format"
          inline
          hint={{ text: "Select a format" }}
        />
      </ListItem>
      <ListItem>
        <InputSimpleSelect
          options={[
            { label: "Black", value: "#000" },
            { label: "White", value: "#FFF" },
            { label: "Green", value: "#F00" },
            { label: "Red", value: "#0F0" },
            { label: "Blue", value: "#00F" },
          ]}
          name="color"
          label="Color"
          inline
        />
      </ListItem>
    </Section>
  )
}

import type { Meta, StoryFn } from "@storybook/react-vite"
import { CodeEditor } from "#ui/forms/CodeEditor"

const setup: Meta<typeof CodeEditor> = {
  title: "Forms/ui/CodeEditor",
  component: CodeEditor,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof CodeEditor> = (args) => {
  return <CodeEditor {...args} />
}

export const Default = Template.bind({})
Default.args = {
  name: "plaintext",
  label: "Message",
  onChange: (value) => {
    console.log("plaintext • Changed to:", value)
  },
  onValidate: (markers) => {
    console.log("plaintext • Markers:", markers)
  },
  defaultValue: "This is just a \nmulti-line plaintext.\n",
}

export const PromotionRules = Template.bind({})
PromotionRules.args = {
  name: "promotions-rules",
  label: "Rules",
  height: "450px",
  onChange: (value) => {
    console.log("promotion rules • Changed to:", value)
  },
  onValidate: (markers) => {
    console.log("promotion rules • Markers:", markers)
  },
  language: "json",
  jsonSchema: "order-rules",
  defaultValue: JSON.stringify(
    {
      rules: [
        {
          id: "b569f656-8bc2-4253-a19b-56062e7653ab",
          name: "Discount 3% if paid by credit card",
          conditions: [
            {
              field: "order.payment_method.payment_source_type",
              matcher: "eq",
              value: "credit_cards",
            },
          ],
          actions: [
            {
              type: "percentage",
              selector: "order",
              value: 3,
            },
          ],
        },
      ],
    },
    undefined,
    2,
  ).concat("\n"),
}

export const PriceListRules = Template.bind({})
PriceListRules.args = {
  name: "price_lists-rules",
  label: "Rules",
  height: "600px",
  onChange: (value) => {
    console.log("price_list rules • Changed to:", value)
  },
  onValidate: (markers) => {
    console.log("price_list rules • Markers:", markers)
  },
  language: "json",
  jsonSchema: "price-rules",
  defaultValue: JSON.stringify(
    {
      rules: [
        {
          id: "ce515b39-c820-46ae-b8e2-11a4e919ee22",
          name: "Price with amount_cents greather than equal 200",
          conditions: [
            {
              field: "price.amount_cents",
              matcher: "gteq",
              value: 200,
            },
          ],
          actions: [
            {
              type: "percentage",
              selector: "price",
              value: "20%",
            },
          ],
        },
      ],
    },
    undefined,
    2,
  ).concat("\n"),
}

export const OrganizationConfig = Template.bind({})
OrganizationConfig.args = {
  name: "organization-config",
  label: "Configuration",
  height: "600px",
  onChange: (value) => {
    console.log("organization config • Changed to:", value)
  },
  onValidate: (markers) => {
    console.log("organization config • Markers:", markers)
  },
  language: "json",
  jsonSchema: "organization-config",
  defaultValue: JSON.stringify({ mfe: { default: {} } }, undefined, 2).concat(
    "\n",
  ),
}

export const WithHint = Template.bind({})
WithHint.args = {
  name: "code-editor-hint",
  label: "Code",
  language: "plaintext",
  hint: {
    text: "Please enter a valid rule",
  },
}

export const WithError = Template.bind({})
WithError.args = {
  name: "code-editor-error",
  label: "Code",
  language: "plaintext",
  feedback: {
    variant: "danger",
    message: "Required field",
  },
}

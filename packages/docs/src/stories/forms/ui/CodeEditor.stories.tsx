import { CodeEditor } from '#ui/forms/CodeEditor'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof CodeEditor> = {
  title: 'Forms/ui/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof CodeEditor> = (args) => {
  return (
    <>
      <CodeEditor {...args} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'plaintext',
  label: 'Message',
  onChange: (value) => {
    console.log('plaintext • Changed to:', value)
  },
  onValidate: (markers) => {
    console.log('plaintext • Markers:', markers)
  },
  defaultValue: 'This is just a \nmulti-line plaintext.\n'
}

export const Rules = Template.bind({})
Rules.args = {
  name: 'rules',
  label: 'Rules',
  height: '520px',
  onChange: (value) => {
    console.log('rules • Changed to:', value)
  },
  onValidate: (markers) => {
    console.log('rules • Markers:', markers)
  },
  language: 'json',
  jsonSchema: 'promotions-rules',
  defaultValue: JSON.stringify(
    {
      rules: [
        {
          id: 'dkt7685f-7760-452e-b9b4-83434b89e2a4',
          name: 'Discount products that are not already discounted (by diff price_amount_cents compared_at_amount_cents)',
          conditions: [
            {
              field:
                'order.line_items.diff_cents_compare_at_amount_unit_amount',
              matcher: 'eq',
              value: 0,
              group: 'discountable_items'
            }
          ],
          actions: [
            {
              type: 'percentage',
              selector: 'order.line_items.sku',
              groups: ['discountable_items'],
              value: '10%'
            }
          ]
        }
      ]
    },
    undefined,
    2
  )
}

export const WithHint = Template.bind({})
WithHint.args = {
  name: 'code-editor-hint',
  label: 'Code',
  language: 'plaintext',
  hint: {
    text: 'Please enter a valid rule'
  }
}

export const WithError = Template.bind({})
WithError.args = {
  name: 'code-editor-error',
  label: 'Code',
  language: 'plaintext',
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}

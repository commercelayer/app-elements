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
  height: '450px',
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
          id: 'b569f656-8bc2-4253-a19b-56062e7653ab',
          name: 'Discount 3% if paid by credit card',
          conditions: [
            {
              field: 'order.payment_method.payment_source_type',
              matcher: 'eq',
              value: 'credit_cards'
            }
          ],
          actions: [
            {
              type: 'percentage',
              selector: 'order',
              value: '3%'
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

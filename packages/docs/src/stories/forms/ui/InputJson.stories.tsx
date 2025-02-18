import { InputJson } from '#ui/forms/InputJson'
import { type Meta, type StoryFn } from '@storybook/react'
import { type JSX, useState } from 'react'

const setup: Meta<typeof InputJson> = {
  title: 'Forms/ui/InputJson',
  component: InputJson,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputJson> = (args) => {
  const [jsonValue, setJsonValue] = useState<object | null>(null)
  return (
    <>
      <InputJson
        {...args}
        onDataReady={(value) => {
          setJsonValue(value)
        }}
        onDataResetRequest={() => {
          setJsonValue(null)
        }}
        validateFn={(maybeJson) => {
          if (maybeJson.data !== undefined) {
            return maybeJson.data
          } else {
            throw new Error()
          }
        }}
      />
      <SamplePreviewData jsonValue={jsonValue} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Configuration',
  onDataReady: () => undefined,
  onDataResetRequest: () => undefined,
  placeholder: { foo: 'bar' },
  validateFn: (v) => v
}

const SamplePreviewData = ({
  jsonValue
}: {
  jsonValue: object | null
}): JSX.Element => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <p>Valid JSON:</p>
      <pre>{JSON.stringify(jsonValue)}</pre>
    </div>
  )
}

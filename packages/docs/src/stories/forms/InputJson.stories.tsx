import { InputJson } from '#ui/forms/InputJson'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof InputJson> = {
  title: 'Forms/InputJson',
  component: InputJson,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputJson> = (args) => {
  const [jsonValue, setJsonValue] = useState<object | null>(null)
  return (
    <>
      <InputJson
        {...args}
        onDataReady={(value) => {
          setJsonValue(value)
        }}
        onDataResetRequest={() => setJsonValue(null)}
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

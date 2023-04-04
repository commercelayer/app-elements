import { InputFile } from '#ui/forms/InputFile'
import { type ComponentMeta, type ComponentStory } from '@storybook/react'
import { useState } from 'react'

const setup: ComponentMeta<typeof InputFile> = {
  title: 'Forms/InputFile',
  component: InputFile,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputFile> = (args) => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <>
      <InputFile
        {...args}
        onChange={(e) => {
          if (e.target.files != null) {
            setFile(e.target.files[0])
          }
        }}
      />
      <div>{file?.name}</div>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'File upload'
}

export const WithProgress = Template.bind({})
WithProgress.args = {
  label: 'File upload',
  progress: 70
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'File upload',
  hint: { text: 'Please enter a valid name' }
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'File upload',
  hint: { text: 'Please enter a valid name' },
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}

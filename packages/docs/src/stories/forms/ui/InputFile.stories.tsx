import { InputFile } from '#ui/forms/InputFile'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputFile> = {
  title: 'Forms/ui/InputFile',
  component: InputFile,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputFile> = (args) => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <>
      <InputFile
        {...args}
        onChange={(e) => {
          if (e.target.files?.[0] !== undefined) {
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

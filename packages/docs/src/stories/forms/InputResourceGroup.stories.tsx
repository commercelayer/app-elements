import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { InputResourceGroup } from '#ui/forms/InputResourceGroup'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputResourceGroup> = {
  title: 'Forms/InputResourceGroup',
  component: InputResourceGroup,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputResourceGroup> = (args) => {
  const [values, setValues] = useState<string[]>([])
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <InputResourceGroup
          {...args}
          defaultValues={values}
          onChange={setValues}
          // fixed values for the story to match msw mocked data
          resource='markets'
          fieldForLabel='name'
          fieldForValue='id'
          searchBy='name_cont'
          sortBy={{ attribute: 'name', direction: 'asc' }}
          previewLimit={3}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resource: 'markets',
  fieldForLabel: 'name',
  fieldForValue: 'id',
  searchBy: 'name_cont',
  sortBy: { attribute: 'name', direction: 'asc' },
  title: 'Markets',
  previewLimit: 3
}

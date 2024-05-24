import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { InputResourceGroup } from '#ui/forms/InputResourceGroup'
import { useInputResourceGroupOverlay } from '#ui/forms/InputResourceGroup/FullList'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputResourceGroup> = {
  title: 'Forms/ui/InputResourceGroup',
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

/**
 * The `useInputResourceGroupOverlay` can be used when you need to select one or more resources and link them to another resource.
 * By default you can always select or deselect a resource from the overlay.
 */
export const UseInputResourceGroupOverlay: StoryFn = () => {
  const [values, setValues] = useState<string[]>([])
  const {
    InputResourceGroupOverlay,
    closeInputResourceGroupOverlay,
    openInputResourceGroupOverlay
  } = useInputResourceGroupOverlay()
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <pre>{JSON.stringify(values, undefined, 2)}</pre>
        <InputResourceGroupOverlay
          defaultValues={values}
          onChange={setValues}
          resource='markets'
          fieldForLabel='name'
          fieldForValue='id'
          searchBy='name_cont'
          sortBy={{ attribute: 'name', direction: 'asc' }}
          title='Markets'
          footer={
            <Button
              fullWidth
              type='button'
              onClick={() => {
                closeInputResourceGroupOverlay()
                alert(JSON.stringify(values, undefined, 2))
              }}
            >
              Apply
            </Button>
          }
        />
        <Spacer top='8'>
          <Button onClick={openInputResourceGroupOverlay}>Open</Button>
        </Spacer>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * The `hideSelected` prop hides all the already selected resources in the overlay.
 */
export const HideSelected: StoryFn = () => {
  const [values, setValues] = useState<string[]>(['dlQbPhNNop', 'AlRevhXQga'])
  const {
    InputResourceGroupOverlay,
    closeInputResourceGroupOverlay,
    openInputResourceGroupOverlay
  } = useInputResourceGroupOverlay()
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <pre>{JSON.stringify(values, undefined, 2)}</pre>
        <InputResourceGroupOverlay
          defaultValues={values}
          onChange={setValues}
          resource='markets'
          fieldForLabel='name'
          fieldForValue='id'
          searchBy='name_cont'
          sortBy={{ attribute: 'name', direction: 'asc' }}
          title='Markets'
          hideSelected
          footer={
            <Button
              fullWidth
              type='button'
              onClick={() => {
                closeInputResourceGroupOverlay()
                alert(JSON.stringify(values, undefined, 2))
              }}
            >
              Add
            </Button>
          }
        />
        <Spacer top='8'>
          <Button onClick={openInputResourceGroupOverlay}>Add</Button>
        </Spacer>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

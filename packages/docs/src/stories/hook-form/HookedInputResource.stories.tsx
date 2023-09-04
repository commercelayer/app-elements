import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { HookedInputResourceGroup } from '#ui/hook-form/HookedInputResourceGroup'
import { type Meta, type StoryFn } from '@storybook/react'
import { MockedHookedForm as HookedForm } from './_MockedHookedForm'

const setup: Meta<typeof HookedInputResourceGroup> = {
  title: 'HookForm/HookedInputResourceGroup',
  component: HookedInputResourceGroup,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputResourceGroup> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <HookedForm>
          <HookedInputResourceGroup {...args} name='markets' />
        </HookedForm>
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

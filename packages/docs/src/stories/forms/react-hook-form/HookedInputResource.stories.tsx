import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputResourceGroup } from '#ui/forms/InputResourceGroup'
import { type Meta, type StoryFn } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputResourceGroup> = {
  title: 'Forms/react-hook-form/HookedInputResourceGroup',
  component: HookedInputResourceGroup,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}
export default setup

const Template: StoryFn<typeof HookedInputResourceGroup> = (args) => {
  const methods = useForm()

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <HookedForm
          {...methods}
          onSubmit={(values) => {
            alert(JSON.stringify(values))
          }}
        >
          <HookedInputResourceGroup {...args} />
          <Spacer top='4'>
            <Button type='submit'>Submit</Button>
          </Spacer>
        </HookedForm>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'markets',
  resource: 'markets',
  fieldForLabel: 'name',
  fieldForValue: 'id',
  sortBy: { attribute: 'name', direction: 'asc' },
  title: 'Markets',
  searchBy: 'name_cont',
  previewLimit: 3
}

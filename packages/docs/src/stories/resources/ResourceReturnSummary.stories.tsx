import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { presetLineItems } from '#ui/resources/ResourceLineItems/ResourceLineItems.mocks'
import { ResourceReturnSummary } from '#ui/resources/ResourceReturnSummary'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceReturnSummary> = {
  title: 'Resources/ResourceReturnSummary',
  component: ResourceReturnSummary,
  parameters: {
    layout: 'padded'
  }
}
export default setup

type Return = Parameters<typeof ResourceReturnSummary>[0]['resource']

const resource: Return = {
  type: 'returns',
  id: 'JZYhBKoLZW',
  number: '45531033/R/0001',
  status: 'requested',

  created_at: '2023-08-22T13:15:21.536Z',
  updated_at: '2023-08-22T13:20:14.617Z',

  return_line_items: [presetLineItems.returnLineItem]
}

const Template: StoryFn<typeof ResourceReturnSummary> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='returns' devMode>
      <CoreSdkProvider>
        <ResourceReturnSummary {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  footerActions: [
    {
      label: 'Approve',
      onClick: () => {
        alert('Approved!')
      }
    },
    {
      label: 'Cancel',
      variant: 'secondary',
      onClick: () => {
        alert('Cancelled!')
      }
    }
  ],
  resource
}

import { CoreSdkProvider, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { ResourceDetails } from '#ui/resources/ResourceDetails'
import { type Meta, type StoryFn } from '@storybook/react'
import { useEffect, useState } from 'react'

const setup: Meta<typeof ResourceDetails> = {
  title: 'Resources/ResourceDetails',
  component: ResourceDetails,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    )
  ]
}

export default setup

type Customer = Awaited<
  ReturnType<
    Awaited<
      ReturnType<typeof useCoreSdkProvider>['sdkClient']
    >['customers']['retrieve']
  >
>

export const ResourceDetailsDefault: StoryFn = () => {
  const { sdkClient } = useCoreSdkProvider()
  const [customer, setSetCustomer] = useState<Customer>()

  useEffect(() => {
    void sdkClient.customers.retrieve('NMWYhbGorj').then((customer) => {
      setSetCustomer(customer)
    })
  }, [sdkClient])

  if (customer == null) return <div>Loading...</div>

  return (
    <TokenProvider kind='integration' appSlug='customers' devMode>
      <CoreSdkProvider>
        <ResourceDetails
          resource={customer}
          onUpdated={async () => {
            console.log('updated')
          }}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

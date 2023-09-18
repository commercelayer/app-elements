import { CoreSdkProvider, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { type Meta, type StoryFn } from '@storybook/react'
import { useEffect, useState } from 'react'

const meta: Meta = {
  title: 'Getting Started/useCoreSdkProvider',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
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

export default meta

type Order = Awaited<
  ReturnType<
    Awaited<
      ReturnType<typeof useCoreSdkProvider>['sdkClient']
    >['orders']['retrieve']
  >
>

export const Default: StoryFn = () => {
  const { sdkClient } = useCoreSdkProvider()
  const [order, setOrder] = useState<Order>()

  useEffect(() => {
    void sdkClient.orders.retrieve('NMWYhbGorj').then((order) => {
      setOrder(order)
    })
  }, [sdkClient])

  return (
    <div>
      Order ID: <b>{order?.id}</b>
    </div>
  )
}

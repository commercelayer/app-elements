import { CoreSdkProvider, useCoreApi } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { type Meta, type StoryFn } from '@storybook/react'

const meta: Meta = {
  title: 'Getting Started/useCoreApi',
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

/**
 * Get a list of orders.
 */
export const Data: StoryFn = () => {
  const {
    data: orders,
    isLoading,
    isValidating,
    error
  } = useCoreApi('orders', 'list', [
    {
      include: [
        'market',
        'customer',
        'line_items',
        'shipping_address',
        'billing_address',
        'shipments',
        'payment_method',
        'payment_source'
      ]
    }
  ])
  return (
    <div>
      isLoading: <b>{String(isLoading)}</b>
      <br />
      isValidating: <b>{String(isValidating)}</b>
      <br />
      error: <b>{error?.message}</b>
      <br />
      Order IDs:{' '}
      <pre>{JSON.stringify(orders?.map((o) => o.id), undefined, 2)}</pre>
    </div>
  )
}

/**
 * You can use the bound [mutate](https://swr.vercel.app/docs/mutation) by providing a valid object. If you pass `undefined` the data will be re-fetched.
 */
export const Mutate: StoryFn = () => {
  const {
    data: order,
    isLoading,
    isValidating,
    error,
    mutate: mutateOrder
  } = useCoreApi('orders', 'retrieve', [
    'NMWYhbGorj',
    {
      include: [
        'market',
        'customer',
        'line_items',
        'shipping_address',
        'billing_address',
        'shipments',
        'payment_method',
        'payment_source'
      ]
    }
  ])
  return (
    <div>
      isLoading: <b>{String(isLoading)}</b>
      <br />
      isValidating: <b>{String(isValidating)}</b>
      <br />
      error: <b>{error?.message}</b>
      <br />
      Order ID: <b>{order?.id}</b>
      <br />
      <Button
        onClick={function () {
          void mutateOrder()
        }}
      >
        Revalidate
      </Button>
      &nbsp;
      <Button
        onClick={function () {
          void mutateOrder({
            id: '1234'
          })
        }}
      >
        Mutate
      </Button>
    </div>
  )
}

/**
 * Searching for a non existing order by providing an invalid order ID.
 */
export const Error: StoryFn = () => {
  const {
    data: order,
    isLoading,
    isValidating,
    error
  } = useCoreApi('orders', 'retrieve', [
    'non-existing',
    {
      include: [
        'market',
        'customer',
        'line_items',
        'shipping_address',
        'billing_address',
        'shipments',
        'payment_method',
        'payment_source'
      ]
    }
  ])
  return (
    <div>
      isLoading: <b>{String(isLoading)}</b>
      <br />
      isValidating: <b>{String(isValidating)}</b>
      <br />
      error: <b>{error?.message}</b>
      <br />
      Order ID: <b>{order?.id}</b>
    </div>
  )
}

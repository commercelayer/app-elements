import {
  CoreSdkProvider,
  useCoreApi,
  useCoreSdkProvider
} from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { type Meta, type StoryFn } from '@storybook/react'
import { useEffect, useState } from 'react'

const meta: Meta = {
  title: 'Getting Started/Core SDK provider',
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

/**
 * Here below a simple example that shows how to use the `useCoreSdkProvider` to get some information about an order once you know its ID:
 */
export const UseCoreSdkProviderDefault: StoryFn = () => {
  const { sdkClient } = useCoreSdkProvider()
  const [order, setOrder] = useState<Order>()

  useEffect(() => {
    void sdkClient.orders.retrieve('NMWYhbGorj').then((order) => {
      setOrder(order)
    })
  }, [sdkClient])

  if (order == null) return <div>Loading...</div>

  return (
    <div>
      <p>
        Order ID: <b>{order.id}</b>
      </p>
      <p>
        Customer Email: <b>{order.customer_email}</b>
      </p>
      <p>
        Language Code: <b>{order.language_code}</b>
      </p>
    </div>
  )
}

/**
 * Here below an example that shows how to get a list of orders using the `useCoreApi` hook:
 */
export const UseCoreApiData: StoryFn = () => {
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
 * You can use the bound [mutate](https://swr.vercel.app/docs/mutation) by providing a valid object (e.g. an existing order ID). If you pass `undefined` the data will be re-fetched:
 */
export const UseCoreApiMutate: StoryFn = () => {
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
      Customer Email: <b>{order?.customer_email}</b>
      <br />
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
          void mutateOrder(
            {
              customer_email: 'ringostarr@commercelayer.io'
            },
            {
              revalidate: false
            }
          )
        }}
      >
        Mutate
      </Button>
    </div>
  )
}

/**
 * As you can see from the example below, searching for a non existing order by providing an invalid order ID will return an error:
 */
export const UseCoreApiError: StoryFn = () => {
  const {
    data: order,
    isLoading,
    isValidating,
    error
  } = useCoreApi('orders', 'retrieve', ['non-existing'])
  return (
    <div>
      isLoading: <b>{String(isLoading)}</b>
      <br />
      isValidating: <b>{String(isValidating)}</b>
      <br />
      error: <b>{error?.errors?.[0].detail}</b>
      <br />
      Order ID: <b>{order?.id}</b>
    </div>
  )
}

import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { type Order } from '@commercelayer/sdk'
import { render } from '@testing-library/react'
import { act, type FC } from 'react'
import { useResourceList, type UseResourceListConfig } from './useResourceList'

const mockedOrder: Order = {
  id: 'mock',
  created_at: '2023-03-15T13:57:06.856Z',
  updated_at: '2023-03-15T13:57:06.856Z',
  type: 'orders',

  fulfillment_status: 'fulfilled',
  payment_status: 'authorized',
  status: 'approved'
}

const ResourceListImplementation: FC<
  Pick<UseResourceListConfig<any>, 'query'>
> = ({ query }) => {
  const { ResourceList } = useResourceList({
    type: 'orders',
    title: 'All orders',
    ItemTemplate: ({ resource = mockedOrder }) => {
      return (
        <div
          data-testid={
            resource.id === 'mock' ? 'orderItem-loading' : 'orderItem-ready'
          }
        >
          <div>Order #{resource.number}</div>
          <div>Total {resource.formatted_total_amount}</div>
        </div>
      )
    },
    query,
    emptyState: <div>No orders found</div>
  })

  return <ResourceList />
}

describe('useResourceList', () => {
  test('Should render list component', async () => {
    const { getByTestId } = render(
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>
    )
    act(() => {
      expect(getByTestId('resource-list')).toBeDefined()
    })
  })

  test('Should show initial loading items', async () => {
    const { getAllByTestId, queryByTestId } = render(
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>
    )
    const loadingItems = getAllByTestId('orderItem-loading')
    expect(loadingItems.length).toBe(8)
    expect(queryByTestId('visibility-trigger')).not.toBeInTheDocument()
  })

  test('Should show fetched items, once loaded', async () => {
    const { findAllByTestId, queryByTestId } = render(
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>
    )
    expect((await findAllByTestId('orderItem-ready')).length).toBe(10)
    expect(queryByTestId('orderItem-loading')).not.toBeInTheDocument()
    expect(queryByTestId('visibility-trigger')).toBeInTheDocument()
  })

  test('Should render computed title', async () => {
    const { findByLabelText, findByText } = render(
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceListImplementation />
        </CoreSdkProvider>
      </TokenProvider>
    )

    const section = await findByLabelText('All orders · 15')
    expect(section).toBeVisible()
    expect(section.tagName).toEqual('SECTION')

    expect(await findByText('All orders · 15')).toBeVisible()
  })

  test('Should render empty list', async () => {
    const { findByText } = render(
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceListImplementation
            query={{
              filters: {
                emptyList: true // fake filter
              }
            }}
          />
        </CoreSdkProvider>
      </TokenProvider>
    )

    expect(await findByText('No orders found')).toBeVisible()
  })
})

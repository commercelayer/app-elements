import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { type Order } from '@commercelayer/sdk'
import { render, waitFor, type RenderResult } from '@testing-library/react'
import { type FC } from 'react'
import { ResourceList, type ResourceListProps } from './ResourceList'

const mockedOrder: Order = {
  id: 'mock',
  created_at: '2023-03-15T13:57:06.856Z',
  updated_at: '2023-03-15T13:57:06.856Z',
  type: 'orders',

  fulfillment_status: 'fulfilled',
  payment_status: 'authorized',
  status: 'approved'
}

const ItemTemplate: FC<{ resource?: Order }> = ({ resource }) => {
  resource = resource != null ? resource : mockedOrder
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
}

const setup = ({
  query
}: Pick<ResourceListProps<any>, 'query'>): RenderResult => {
  return render(
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList
          type='orders'
          title='All orders'
          ItemTemplate={ItemTemplate}
          query={query}
          emptyState={<div>No orders found</div>}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

describe('ResourceList', () => {
  test('Should render', async () => {
    const { getByTestId } = setup({})
    expect(getByTestId('resource-list')).toBeDefined()
  })

  test('Should show initial loading items', async () => {
    const { getAllByTestId, queryByTestId } = setup({})
    const loadingItems = getAllByTestId('orderItem-loading')
    expect(loadingItems.length).toBe(8)
    expect(queryByTestId('visibility-trigger')).not.toBeInTheDocument()
  })

  test('Should show fetched items, once loaded', async () => {
    const { findAllByTestId, queryByTestId } = setup({})
    expect((await findAllByTestId('orderItem-ready')).length).toBe(10)
    expect(queryByTestId('orderItem-loading')).not.toBeInTheDocument()
    expect(queryByTestId('visibility-trigger')).toBeInTheDocument()
  })

  test('Should render computed title', async () => {
    const { findByLabelText, findByText } = setup({})

    const section = await findByLabelText('All orders · 15')
    expect(section).toBeVisible()
    expect(section.tagName).toEqual('SECTION')

    expect(await findByText('All orders · 15')).toBeVisible()
  })

  test('Should render empty list', async () => {
    const { findByText } = setup({
      query: {
        filters: {
          emptyList: true // fake filter
        }
      }
    })
    expect(await findByText('No orders found')).toBeVisible()
  })

  // TODO: fix this flaky test
  test.skip('Should fetch more', async () => {
    const { findAllByTestId, queryByTestId, getAllByTestId } = setup({})
    expect((await findAllByTestId('orderItem-ready')).length).toBe(10)
    expect(queryByTestId('orderItem-loading')).not.toBeInTheDocument()
    expect(queryByTestId('visibility-trigger')).toBeInTheDocument()

    window.dispatchEvent(new Event('triggerIntersection'))
    await waitFor(() => {
      expect(getAllByTestId('orderItem-ready').length).toBe(20)
    })
  })
})

import CommerceLayer, { type Order } from '@commercelayer/sdk'
import { render, type RenderResult, waitFor } from '@testing-library/react'
import { type FC } from 'react'
import {
  ResourceList,
  type ResourceListProps,
  computeTitleWithTotalCount
} from './index'

const mockedOrder: Order = {
  id: 'mock',
  created_at: '2023-03-15T13:57:06.856Z',
  updated_at: '2023-03-15T13:57:06.856Z',
  type: 'orders',

  fulfillment_status: 'fulfilled',
  payment_status: 'authorized',
  status: 'approved'
}

const Item: FC<{ resource?: Order }> = ({ resource }) => {
  resource = resource != null ? resource : mockedOrder
  return (
    <div
      data-test-id={
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
    <ResourceList
      type='orders'
      title='All orders'
      Item={Item}
      query={query}
      emptyState={{
        title: 'No orders found'
      }}
      sdkClient={CommerceLayer({
        accessToken: 'abc123',
        organization: 'demo-store'
      })}
    />
  )
}

describe('ResourceList', () => {
  test('Should render', async () => {
    const { getByTestId } = setup({})
    expect(getByTestId('resource-list')).toBeVisible()
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
    const { findByText } = setup({})
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

describe('computeTitleWithTotalCount', () => {
  test('Should display count formatted as US', () => {
    expect(
      computeTitleWithTotalCount({
        title: 'Total',
        recordCount: 10200,
        locale: 'en-US'
      })
    ).toBe('Total · 10,200')
  })

  test('Should display count formatted as IT', () => {
    expect(
      computeTitleWithTotalCount({
        title: 'Total',
        recordCount: 10200,
        locale: 'it-IT'
      })
    ).toBe('Total · 10.200')
  })

  test('should ignore interpolation when title is not a string', () => {
    const component = <div>Total</div>
    expect(
      computeTitleWithTotalCount({
        title: component,
        recordCount: 10200
      })
    ).toBe(component)
  })

  test('should ignore interpolation when recordCount is zero or undefined', () => {
    expect(
      computeTitleWithTotalCount({
        title: 'Records',
        recordCount: 0
      })
    ).toBe('Records')
    expect(
      computeTitleWithTotalCount({
        title: 'Records'
      })
    ).toBe('Records')
  })
})

import { render, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import { GTMProvider, useTagManager } from './GTMProvider'

vi.mock('react-gtm-module', async () => {
  return {
    default: {
      initialize: vi.fn(),
      dataLayer: vi.fn()
    }
  }
})

describe('GTMProvider', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Should initialize GTM', async () => {
    const { getByText } = render(
      <GTMProvider gtmId='GTM-123456A'>
        <div>App</div>
      </GTMProvider>
    )

    expect(getByText('App')).toBeInTheDocument()
    expect(TagManager.initialize).toHaveBeenNthCalledWith(1, {
      gtmId: 'GTM-123456A'
    })
  })

  test('Should not initialize GTM if gtmId is invalid', async () => {
    const { getByText } = render(
      <GTMProvider gtmId='GT-123456'>
        <div>App</div>
      </GTMProvider>
    )

    expect(getByText('App')).toBeInTheDocument()
    expect(TagManager.initialize).toHaveBeenCalledTimes(0)
  })

  test('Should render children also when gtmId is not provided', async () => {
    const { getByText } = render(
      <GTMProvider>
        <div>App</div>
      </GTMProvider>
    )

    expect(getByText('App')).toBeInTheDocument()
    expect(TagManager.initialize).toHaveBeenCalledTimes(0)
  })
})

describe('useTagManager', () => {
  test('Should push data with useTagManager hook', async () => {
    const InnerComponent = (): JSX.Element => {
      const gtm = useTagManager()

      useEffect(() => {
        gtm?.push({ event: 'test-event' })
      }, [])

      return <div>inner component</div>
    }

    const { getByText } = render(
      <GTMProvider>
        <InnerComponent />
      </GTMProvider>
    )

    expect(getByText('inner component')).toBeInTheDocument()

    void waitFor(() => {
      expect(TagManager.dataLayer).toHaveBeenNthCalledWith(1, {
        event: 'test-event'
      })
    })
  })
})

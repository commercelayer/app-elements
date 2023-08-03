import {
  goBack,
  navigateToDetail,
  type BackToItem
} from '#helpers/appsNavigation'

// should always match version set in appsNavigation.ts
const currentVersion = 0.2

const fakeEvent = {
  preventDefault: () => undefined
} as unknown as React.MouseEvent<any, any>

function getSessionStorageItem(key: string): BackToItem {
  return JSON.parse(sessionStorage.getItem(key) ?? '{}')
}

const originalLocationObj = window.location
function allowLocationMocks(): void {
  window.location = {
    ...originalLocationObj,
    origin: 'https://demo-store.commercelayer.app'
  }
}

describe('navigateToDetail', () => {
  beforeEach(() => {
    sessionStorage.clear()
    allowLocationMocks()
    vi.resetAllMocks()
  })

  test('should return an href string', () => {
    const navigate = navigateToDetail({
      setLocation: () => undefined,
      destination: {
        app: 'customers',
        resourceId: 'xBszDaQsAZ',
        mode: 'live'
      }
    })

    expect(navigate.href).toBe(
      'https://demo-store.commercelayer.app/customers/list/xBszDaQsAZ?mode=live'
    )
  })

  test('should return a valid onClick handlers for external app linking and store key in sessionStorage', () => {
    // simulating we are on order details in app-order
    window.location.href =
      'https://demo-store.commercelayer.app/orders/list/<orderId>'
    window.location.assign = vi.fn()

    // we want to x-link to a customer details in app-customers
    const navigate = navigateToDetail({
      setLocation: () => {},
      destination: {
        app: 'customers',
        resourceId: '<customerId>',
        mode: 'test'
      }
    })

    navigate.onClick(fakeEvent)

    expect(window.location.assign).toBeCalledWith(
      'https://demo-store.commercelayer.app/customers/list/<customerId>?mode=test'
    )
    expect(
      getSessionStorageItem(
        'https://demo-store.commercelayer.app/customers/list/<customerId>'
      )
    ).toEqual({
      url: 'https://demo-store.commercelayer.app/orders/list/<orderId>',
      version: currentVersion
    })
  })

  test('should return a valid onClick handlers for internal app linking and store key in sessionStorage', () => {
    // simulating we are on orders filtered list in app-orders
    window.location.href =
      'https://demo-store.commercelayer.app/orders/list?archived_at_null=show&fulfillment_status_in=in_progress&status_in=approved&viewTitle=Fulfillment+in+progress'
    const mockedSetLocation = vi.fn()

    // we want to x-link to customers app
    const navigate = navigateToDetail({
      setLocation: mockedSetLocation,
      destination: {
        app: 'orders',
        resourceId: 'xbSzDaQsAZ',
        mode: 'test'
      }
    })

    navigate.onClick(fakeEvent)

    // internal react router should be called
    expect(mockedSetLocation).toBeCalledWith('/list/xbSzDaQsAZ')

    // session storage key should contain url to go back to filtered list
    expect(
      getSessionStorageItem(
        'https://demo-store.commercelayer.app/orders/list/xbSzDaQsAZ'
      )
    ).toEqual({
      url: 'https://demo-store.commercelayer.app/orders/list?archived_at_null=show&fulfillment_status_in=in_progress&status_in=approved&viewTitle=Fulfillment+in+progress',
      version: 0.2
    })
  })
})

describe('goBack', () => {
  test('should go back to default provided path when sessionStorage is empty', () => {
    const mockedSetLocation = vi.fn()
    goBack({
      defaultRelativePath: '/list',
      setLocation: mockedSetLocation
    })
    expect(mockedSetLocation).toBeCalledWith('/list')
  })

  test('should go back to url in session storage when found (internal linking)', () => {
    const mockedSetLocation = vi.fn()

    location.href =
      'https://demo-store.commercelayer.app/orders/list/xbSzDaQsAZ'
    sessionStorage.setItem(
      'https://demo-store.commercelayer.app/orders/list/xbSzDaQsAZ',
      JSON.stringify({
        url: 'https://demo-store.commercelayer.app/orders/list?archived_at_null=show&fulfillment_status_in=in_progress&status_in=approved&viewTitle=Fulfillment+in+progress',
        version: currentVersion
      })
    )
    goBack({
      defaultRelativePath: '/list',
      setLocation: mockedSetLocation
    })
    expect(mockedSetLocation).toBeCalledWith(
      '/list?archived_at_null=show&fulfillment_status_in=in_progress&status_in=approved&viewTitle=Fulfillment+in+progress'
    )
  })

  test('should go back to url in session storage when found (cross app linking)', () => {
    window.location.assign = vi.fn()

    location.href =
      'https://demo-store.commercelayer.app/customers/list/customerId'
    sessionStorage.setItem(
      'https://demo-store.commercelayer.app/customers/list/customerId',
      JSON.stringify({
        url: 'https://demo-store.commercelayer.app/order/list/xbSzDaQsAZ',
        version: currentVersion
      })
    )
    goBack({
      defaultRelativePath: '/list',
      setLocation: () => undefined
    })
    expect(window.location.assign).toBeCalledWith(
      'https://demo-store.commercelayer.app/order/list/xbSzDaQsAZ'
    )
  })
})

import { createRoute, createTypedRoute } from './route'

describe('createRoute', () => {
  it('`makePath` should be without variables when `path` does not have variables', () => {
    const home = createRoute('/')
    expect(home.path).toEqual('/')
    expect(home.makePath({})).toEqual('/')
    expect(
      home.makePath({ promotionId: '1234' }, 'firstname=John&lastname=Doe')
    ).toEqual('/?firstname=John&lastname=Doe')

    const list = createRoute('/orders/')
    expect(list.path).toEqual('/orders')
    expect(list.makePath({})).toEqual('/orders')
    expect(
      list.makePath({ promotionId: '1234' }, 'firstname=John&lastname=Doe')
    ).toEqual('/orders?firstname=John&lastname=Doe')
  })

  it('`makePath` should accepts a list of variables based on the provided `path`', () => {
    const route = createRoute('/list/:promotionId/edit/:name?/')
    expect(route.path).toEqual('/list/:promotionId/edit/:name?')
    expect(route.makePath({ promotionId: '1234', name: 'John' })).toEqual(
      '/list/1234/edit/John'
    )
    expect(
      route.makePath({ promotionId: '1234' }, 'firstname=John&lastname=Doe')
    ).toEqual('/list/1234/edit?firstname=John&lastname=Doe')

    const ordersRoute = createRoute('/orders/:orderId?/')
    expect(ordersRoute.makePath({})).toEqual('/orders')
    expect(ordersRoute.makePath({ orderId: '1234' })).toEqual('/orders/1234')
  })
})

describe('createTypedRoute', () => {
  it('`makePath` should accepts a list of variables with the defined types', () => {
    const route = createTypedRoute<{
      orderNumber: number
      shipmentCode?: 'IT' | 'US'
    }>()('/orders/:orderNumber/:shipmentCode?/')
    expect(route.path).toEqual('/orders/:orderNumber/:shipmentCode?')
    expect(
      route.makePath({ orderNumber: 1234 }, 'firstname=John&lastname=Doe')
    ).toEqual('/orders/1234?firstname=John&lastname=Doe')
    expect(route.makePath({ orderNumber: 1234, shipmentCode: 'IT' })).toEqual(
      '/orders/1234/IT'
    )
    expect(
      route.makePath({ orderNumber: 1234 }, 'firstname=John&lastname=Doe')
    ).toEqual('/orders/1234?firstname=John&lastname=Doe')
    expect(
      route.makePath(
        { orderNumber: 1234, shipmentCode: 'US' },
        'firstname=John&lastname=Doe'
      )
    ).toEqual('/orders/1234/US?firstname=John&lastname=Doe')
  })
})

import { formatResourceName } from './resources'

describe('formatResourceName', () => {
  test('should return singular lowercase as default', () => {
    expect(formatResourceName({ resource: 'orders' })).toBe('order')
    expect(formatResourceName({ resource: 'skus' })).toBe('SKU')
  })

  test('should return singular for count 1 or `singular`', () => {
    expect(formatResourceName({ resource: 'addresses', count: 1 })).toBe(
      'address'
    )
    expect(
      formatResourceName({ resource: 'shipments', count: 'singular' })
    ).toBe('shipment')
  })

  test('should return plural lowercase as default with count', () => {
    expect(formatResourceName({ resource: 'orders', count: 10 })).toBe('orders')
    expect(formatResourceName({ resource: 'skus', count: 'plural' })).toBe(
      'SKUs'
    )
    expect(
      formatResourceName({ resource: 'satispay_gateways', count: 'plural' })
    ).toBe('satispay gateways')
  })

  test('should return plural when count is zero', () => {
    expect(formatResourceName({ resource: 'attachments', count: 0 })).toBe(
      'attachments'
    )
  })

  test('should handle simple titlecase name', () => {
    expect(
      formatResourceName({
        resource: 'orders',
        count: 10,
        format: 'title'
      })
    ).toBe('Orders')

    expect(
      formatResourceName({
        resource: 'checkout_com_payments',
        count: 10,
        format: 'title'
      })
    ).toBe('Checkout.com payments')

    expect(
      formatResourceName({
        resource: 'checkout_com_payments',
        count: 1,
        format: 'title'
      })
    ).toBe('Checkout.com payment')
  })

  test('should handle special title case for SKU wordings', () => {
    expect(
      formatResourceName({
        resource: 'sku_list_items',
        count: 1,
        format: 'title'
      })
    ).toBe('SKU list item')

    expect(
      formatResourceName({
        resource: 'sku_list_items',
        count: 10,
        format: 'title'
      })
    ).toBe('SKU list items')

    expect(
      formatResourceName({
        resource: 'skus',
        count: 1,
        format: 'title'
      })
    ).toBe('SKU')

    expect(
      formatResourceName({
        resource: 'skus',
        count: 10,
        format: 'title'
      })
    ).toBe('SKUs')

    expect(
      formatResourceName({
        resource: 'sku_lists',
        count: 'plural',
        format: 'title'
      })
    ).toBe('SKU lists')
  })
})

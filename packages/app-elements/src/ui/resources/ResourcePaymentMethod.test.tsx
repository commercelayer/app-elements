import { fireEvent, render } from '@testing-library/react'
import { ResourcePaymentMethod } from './ResourcePaymentMethod'
import {
  orderWithoutPaymentSourceResponse,
  orderWithPaymentSourceResponse
} from './ResourcePaymentMethod.mocks'

describe('ResourcePaymentMethod', () => {
  it('should render the component', () => {
    const { getByText } = render(
      <ResourcePaymentMethod resource={orderWithoutPaymentSourceResponse} />
    )
    expect(getByText('Adyen Payment')).toBeVisible()
  })

  it('should show the expandable show more button', async () => {
    const { getByText, queryByText } = render(
      <ResourcePaymentMethod resource={orderWithPaymentSourceResponse} />
    )
    expect(getByText('Adyen Payment')).toBeVisible()
    expect(getByText('Amex credit card')).toBeVisible()
    expect(getByText('··4242')).toBeVisible()

    // expandable content is enabled
    expect(getByText('Show more')).toBeVisible()

    // show payment response block
    fireEvent.click(getByText('Show more'))
    expect(getByText('Show less')).toBeVisible()
    expect(getByText('resultCode:')).toBeVisible()
    expect(getByText('fraudResult:')).toBeVisible()

    // hide payment response block
    fireEvent.click(getByText('Show less'))
    expect(queryByText('Show more')).toBeVisible()
    expect(queryByText('Show less')).not.toBeInTheDocument()
    expect(queryByText('resultCode:')).not.toBeInTheDocument()
    expect(queryByText('fraudResult:')).not.toBeInTheDocument()
  })
})

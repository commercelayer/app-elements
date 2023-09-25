import { render, type RenderResult } from '@testing-library/react'
import { ResourceAddress } from './ResourceAddress'
import { presetAddresses } from './ResourceAddress.mocks'

const setup = (): RenderResult => {
  return render(
    <ResourceAddress
      resource={presetAddresses.withName}
      showBillingInfo
      editable
    />
  )
}

describe('ResourceAddress', () => {
  test('Should render', async () => {
    const { getByTestId } = setup()
    expect(getByTestId('ResourceAddress')).toBeInTheDocument()
  })

  test('Should not render title', async () => {
    const { queryByTestId } = setup()
    expect(queryByTestId('ResourceAddress-title')).not.toBeInTheDocument()
  })

  test('Should render fullName', async () => {
    const { getByTestId } = setup()
    expect(getByTestId('ResourceAddress-fullName')).toContainHTML('Darth Vader')
  })

  test('Should render address', async () => {
    const { getByTestId } = setup()
    expect(getByTestId('ResourceAddress-address')).toContainHTML(
      'Via Morte Nera, 13'
    )
  })

  test('Should render phone', async () => {
    const { getByTestId } = setup()
    expect(getByTestId('ResourceAddress-phone')).toContainHTML(
      '+39 055 1234567890'
    )
  })

  test('Should render billingInfo', async () => {
    const { queryByTestId } = setup()
    expect(queryByTestId('ResourceAddress-billingInfo')).toBeInTheDocument()
  })

  test('Should render editAction', async () => {
    const { queryByTestId } = setup()
    expect(queryByTestId('ResourceAddress-editAction')).toBeInTheDocument()
  })
})

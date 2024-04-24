import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import {
  fireEvent,
  render,
  waitFor,
  type RenderResult
} from '@testing-library/react'
import { ResourceAddress } from './ResourceAddress'
import { presetAddresses } from './ResourceAddress.mocks'

const addressUpdate = vi.fn().mockResolvedValue({})

vi.mock('#providers/CoreSdkProvider', async (importOriginal) => {
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    useCoreSdkProvider: vi.fn().mockImplementation(() => ({
      sdkClient: {
        addresses: {
          update: addressUpdate
        }
      }
    }))
  }
})

const setup = (): RenderResult => {
  return render(
    <MockTokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceAddress
          resource={presetAddresses.withNotes}
          showBillingInfo
          editable
        />
      </CoreSdkProvider>
    </MockTokenProvider>
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
    expect(getByTestId('ResourceAddress-fullName')).toContainHTML(
      'Luke Skywalker'
    )
  })

  test('Should render address', async () => {
    const { getByTestId } = setup()
    expect(getByTestId('ResourceAddress-address')).toContainHTML(
      'Via Polis Massa, 42'
    )
  })

  test('Should render phone', async () => {
    const { getByText } = setup()
    expect(getByText('+39 055 1234567890')).toBeVisible()
  })

  test('Should render notes', async () => {
    const { getByText } = setup()
    expect(
      getByText('Kindly leave the package to my neighbor, Adam Sandler.')
    ).toBeVisible()
  })

  test('Should render billingInfo', async () => {
    const { queryByTestId } = setup()
    expect(queryByTestId('ResourceAddress-billingInfo')).toBeVisible()
  })

  test('Should render edit button', async () => {
    const { queryByTestId } = setup()
    expect(queryByTestId('ResourceAddress-editButton')).toBeVisible()
  })

  test('Should open edit Overlay and submit the form', async () => {
    const { getByTestId, getByText } = setup()
    const editButton = getByTestId('ResourceAddress-editButton')
    await waitFor(() => {
      fireEvent.click(editButton)
    })

    const saveAddressButton = getByText('Update address')
    expect(getByText('Edit address')).toBeVisible()
    expect(saveAddressButton).toBeVisible()
    await waitFor(() => {
      fireEvent.click(saveAddressButton)
    })

    expect(addressUpdate).toHaveBeenCalledTimes(1)
  })
})

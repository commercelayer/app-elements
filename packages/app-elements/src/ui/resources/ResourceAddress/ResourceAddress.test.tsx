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
          resource={presetAddresses.withName}
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

  test('Should open edit Overlay and submit the form', async () => {
    const { queryByText, getByText } = setup()
    expect(queryByText('Edit')).not.toBe(null)
    await waitFor(() => {
      fireEvent.click(getByText('Edit'))
    })

    expect(queryByText('Edit address')).not.toBe(null)
    expect(queryByText('Update address')).not.toBe(null)

    await waitFor(() => {
      fireEvent.click(getByText('Update address'))
    })

    expect(addressUpdate).toHaveBeenCalledTimes(1)
  })
})

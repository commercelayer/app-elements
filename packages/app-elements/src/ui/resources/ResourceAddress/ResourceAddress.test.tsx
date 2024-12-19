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
const addressCreate = vi.fn().mockResolvedValue({})

vi.mock('#providers/CoreSdkProvider', async (importOriginal) => {
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    useCoreSdkProvider: vi.fn().mockImplementation(() => ({
      sdkClient: {
        addresses: {
          update: addressUpdate,
          create: addressCreate
        }
      }
    }))
  }
})

beforeEach(() => {
  addressUpdate.mockClear()
  addressCreate.mockClear()
})

const setup = (): RenderResult => {
  return render(
    <MockTokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceAddress
          address={presetAddresses.withNotes}
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
    expect(queryByTestId('ResourceAddress-noAddress')).not.toBeInTheDocument()
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

  test('Should open edit Overlay and submit the form editing an existing address', async () => {
    const { getByTestId, getByText } = setup()
    const editButton = getByTestId('ResourceAddress-editButton')
    await waitFor(() => {
      fireEvent.click(editButton)
    })

    const saveAddressButton = getByText(
      'common.update resources.addresses.name'
    )
    expect(getByText('common.edit resources.addresses.name')).toBeVisible()
    expect(saveAddressButton).toBeVisible()
    await waitFor(() => {
      fireEvent.click(saveAddressButton)
    })

    expect(addressUpdate).toHaveBeenCalledTimes(1)
  })

  test('Should render a default message when resource is not set', async () => {
    const { queryByTestId } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceAddress showBillingInfo editable />
        </CoreSdkProvider>
      </MockTokenProvider>
    )

    expect(queryByTestId('ResourceAddress-noAddress')).toBeVisible()
  })

  test('Should open create Overlay and submit the form creating a new address', async () => {
    const { getByTestId, getByText, getByLabelText, queryByText } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceAddress showBillingInfo editable />
        </CoreSdkProvider>
      </MockTokenProvider>
    )

    const editButton = getByTestId('ResourceAddress-editButton')
    await waitFor(() => {
      fireEvent.click(editButton)
    })

    expect(getByText('common.new resources.addresses.name')).toBeVisible()

    const createAddressButton = getByText(
      'common.create resources.addresses.name'
    )
    expect(createAddressButton).toBeVisible()

    fireEvent.keyDown(getByText('Select...'), {
      key: 'ArrowDown'
    })
    await waitFor(() => queryByText('Angola'))
    expect(queryByText('Angola')).toBeVisible()
    fireEvent.click(getByText('Angola'))

    await waitFor(() => {
      fireEvent.change(
        getByLabelText('resources.addresses.attributes.first_name'),
        {
          target: { value: 'John' }
        }
      )

      fireEvent.change(
        getByLabelText('resources.addresses.attributes.last_name'),
        {
          target: { value: 'Doe' }
        }
      )

      fireEvent.change(
        getByLabelText('resources.addresses.attributes.line_1'),
        {
          target: { value: 'Via tutti' }
        }
      )

      fireEvent.change(getByLabelText('resources.addresses.attributes.city'), {
        target: { value: 'Milan' }
      })

      fireEvent.change(
        getByLabelText('resources.addresses.attributes.state_code'),
        {
          target: { value: 'FR' }
        }
      )

      fireEvent.change(
        getByLabelText('resources.addresses.attributes.zip_code'),
        {
          target: { value: '20090' }
        }
      )

      fireEvent.change(getByLabelText('resources.addresses.attributes.phone'), {
        target: { value: '-' }
      })
    })

    await waitFor(() => {
      fireEvent.click(createAddressButton)
    })

    expect(addressCreate).toHaveBeenCalledTimes(1)
  })
})

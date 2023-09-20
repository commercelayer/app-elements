import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { fireEvent, render, waitFor, within } from '@testing-library/react'
import { ResourceLineItems } from './ResourceLineItems'
import { presetLineItems } from './ResourceLineItems.mocks'

const lineItemUpdate = vi.fn().mockResolvedValue({})
const lineItemDelete = vi.fn().mockResolvedValue({})

vi.mock('#providers/CoreSdkProvider', async (importOriginal) => {
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    useCoreApi: vi.fn().mockImplementation((resource, action) => {
      if (resource === 'bundles' && action === 'list') {
        return {
          data: [
            {
              sku_list: {
                sku_list_items: [
                  {
                    id: 'LWKOPINkWM',
                    sku_code: 'TSHIRTMS000000FFFFFFLXXX',
                    quantity: 1,
                    sku: {
                      name: 'Black Men T-Shirt with White Logo (L)',
                      image_url:
                        'https://data.commercelayer.app/seed/images/skus/TSHIRTMS000000FFFFFFLXXX_FLAT.png'
                    }
                  },
                  {
                    id: 'vWbjGINmWn',
                    sku_code: 'SWEETHMUB7B7B7000000MXXX',
                    quantity: 2,
                    sku: {
                      name: 'Sport Grey Unisex Hoodie Sweatshirt with Black Logo (M)',
                      image_url:
                        'https://data.commercelayer.app/seed/images/skus/HOODIEMX7F7F7F000000MXXX_FLAT.png'
                    }
                  }
                ]
              }
            }
          ],
          isLoading: false
        }
      }
    }),
    useCoreSdkProvider: vi.fn().mockImplementation(() => ({
      sdkClient: {
        line_items: {
          update: lineItemUpdate,
          delete: lineItemDelete
        }
      }
    }))
  }
})

describe('ResourceLineItems', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render', () => {
    const { getAllByRole, container } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceLineItems items={[presetLineItems.oneLine]} />
        </CoreSdkProvider>
      </MockTokenProvider>
    )
    expect(container).toMatchSnapshot()

    const rows = getAllByRole('row')
    expect(rows.length).toEqual(4)

    const [firstRow, secondRow, thirdRow, fourthRow] = rows
    assertToBeDefined(firstRow)
    assertToBeDefined(secondRow)
    assertToBeDefined(thirdRow)
    assertToBeDefined(fourthRow)

    expect(
      within(firstRow).getByText('BABYBIBXA19D9D000000XXXX')
    ).toBeInTheDocument()
    expect(
      within(secondRow).getByText('Gray Baby Bib with Black Logo')
    ).toBeInTheDocument()
    expect(within(secondRow).getByText('x 2')).toBeInTheDocument()
    expect(within(secondRow).getByText('x 2')).not.toHaveClass('hidden')
    expect(within(secondRow).getByText('18.00€')).toBeInTheDocument()
    expect(within(secondRow).getByText('Unit price 9.00€')).toBeInTheDocument()
    expect(within(thirdRow).getByRole('cell').children.length).toEqual(0)
    expect(within(fourthRow).getByRole('cell').children.length).toEqual(0)
  })

  it('should render the Footer prop when defined', () => {
    const { getAllByRole, container } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceLineItems
            items={[presetLineItems.oneLine]}
            footer={<div>Ehi there!</div>}
          />
        </CoreSdkProvider>
      </MockTokenProvider>
    )
    expect(container).toMatchSnapshot()

    const rows = getAllByRole('row')
    expect(rows.length).toEqual(5)

    const [, , , , fifthRow] = rows
    assertToBeDefined(fifthRow)

    expect(within(fifthRow).getByText('Ehi there!')).toBeInTheDocument()
  })

  it('should only show "type" equal to "line_items" ("item_type" attribute equal to "skus", "bundles" or "gift_cards" with amount greater than 0), "stock_line_items", "parcel_line_item" or "return_line_item"', () => {
    const { queryAllByText } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceLineItems items={Object.values(presetLineItems)} />
        </CoreSdkProvider>
      </MockTokenProvider>
    )

    expect(queryAllByText('Gray Baby Bib with Black Logo').length).toEqual(1)
    expect(queryAllByText('Welcome KIT').length).toEqual(1)
    expect(queryAllByText('name: Ringo Starr').length).toEqual(1)
    expect(
      queryAllByText('Gray Men T-Shirt with Black Logo (L)').length
    ).toEqual(1)
    expect(queryAllByText('White Water Bottle with Black Logo').length).toEqual(
      1
    )
    expect(queryAllByText('Enamel Mug with Black Logo').length).toEqual(1)
    expect(queryAllByText('Gift card: €9,00').length).toEqual(0)
    expect(queryAllByText('Gift card: €100,00').length).toEqual(1)
  })

  it('should render the list item options', () => {
    const { getAllByRole, container } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceLineItems items={[presetLineItems.withOptions]} />
        </CoreSdkProvider>
      </MockTokenProvider>
    )
    expect(container).toMatchSnapshot()

    const rows = getAllByRole('row')
    expect(rows.length).toEqual(4)

    const [, , thirdRow] = rows
    assertToBeDefined(thirdRow)

    expect(within(thirdRow).getByRole('cell').children.length).toEqual(1)
    expect(within(thirdRow).getByText('Front Text')).toBeInTheDocument()
    expect(
      within(thirdRow).getByText('line1: Commerce Layer')
    ).toBeInTheDocument()
    expect(
      within(thirdRow).getByText('line2: Composable Commerce API')
    ).toBeInTheDocument()
    expect(within(thirdRow).getByText('Rear Text')).toBeInTheDocument()
    expect(within(thirdRow).getByText('name: Ringo Starr')).toBeInTheDocument()
    expect(within(thirdRow).getByText('team: Beatles')).toBeInTheDocument()
    expect(within(thirdRow).getByText('Special')).toBeInTheDocument()
    expect(
      within(thirdRow).getByText(
        'logo_url: http://data.commercelayer.com/long_url/logo.png'
      )
    ).toBeInTheDocument()
    expect(
      within(thirdRow).getByText('colors: ["#400","#fff","#000fff"]')
    ).toBeInTheDocument()
    expect(
      within(thirdRow).getByText('position: {"x":30,"y":10}')
    ).toBeInTheDocument()
  })

  it('should render the bundle', () => {
    const { getAllByRole, container } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceLineItems items={[presetLineItems.withBundle]} />
        </CoreSdkProvider>
      </MockTokenProvider>
    )
    expect(container).toMatchSnapshot()

    const rows = getAllByRole('row')
    expect(rows.length).toEqual(4)

    const [firstRow, secondRow, thirdRow, fourthRow] = rows
    assertToBeDefined(firstRow)
    assertToBeDefined(secondRow)
    assertToBeDefined(thirdRow)
    assertToBeDefined(fourthRow)

    expect(within(firstRow).getByText('WELCOME_KIT_001')).toBeInTheDocument()
    expect(within(secondRow).getByText('Welcome KIT')).toBeInTheDocument()
    expect(within(secondRow).getByText('x 1')).toBeInTheDocument()
    expect(within(secondRow).getByText('x 1')).not.toHaveClass('hidden')
    expect(within(secondRow).getByText('$10.00')).toBeInTheDocument()
    expect(within(secondRow).getByText('Unit price $10.00')).toBeInTheDocument()
    expect(within(thirdRow).getByRole('cell').children.length).toEqual(1)
    expect(within(thirdRow).getByText('x 1')).toBeInTheDocument()
    expect(
      within(thirdRow).getByAltText('Black Men T-Shirt with White Logo (L)')
    ).toHaveAttribute(
      'src',
      'https://data.commercelayer.app/seed/images/skus/TSHIRTMS000000FFFFFFLXXX_FLAT.png'
    )
    expect(
      within(thirdRow).getByText('Black Men T-Shirt with White Logo (L)')
    ).toBeInTheDocument()
    expect(within(thirdRow).getByText('x 2')).toBeInTheDocument()

    expect(
      within(thirdRow).getByAltText(
        'Sport Grey Unisex Hoodie Sweatshirt with Black Logo (M)'
      )
    ).toHaveAttribute(
      'src',
      'https://data.commercelayer.app/seed/images/skus/HOODIEMX7F7F7F000000MXXX_FLAT.png'
    )
    expect(
      within(thirdRow).getByText(
        'Sport Grey Unisex Hoodie Sweatshirt with Black Logo (M)'
      )
    ).toBeInTheDocument()
    expect(within(fourthRow).getByRole('cell').children.length).toEqual(0)
  })

  it('should render the InputSpinner and the trash icon when editable', async () => {
    const { getAllByRole, container } = render(
      <MockTokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <ResourceLineItems items={[presetLineItems.oneLine]} editable />
        </CoreSdkProvider>
      </MockTokenProvider>
    )
    expect(container).toMatchSnapshot()

    const rows = getAllByRole('row')
    expect(rows.length).toEqual(4)

    const [, secondRow, thirdRow] = rows
    assertToBeDefined(secondRow)
    assertToBeDefined(thirdRow)

    const inputSpinner: HTMLInputElement =
      within(thirdRow).getByTestId('InputSpinner-input')
    const inputSpinnerDecrement: HTMLInputElement = within(
      thirdRow
    ).getByTestId('InputSpinner-decrement')
    const inputSpinnerIncrement: HTMLInputElement = within(
      thirdRow
    ).getByTestId('InputSpinner-increment')

    const deleteButton: HTMLButtonElement =
      within(thirdRow).getByLabelText('Delete')

    expect(within(secondRow).getByText('x 2')).toHaveClass('hidden')
    expect(within(thirdRow).getByRole('cell').children.length).toEqual(1)
    expect(inputSpinner).toBeInTheDocument()
    expect(inputSpinner.value).toEqual('2')
    expect(deleteButton).toBeInTheDocument()

    await waitFor(() => {
      fireEvent.click(inputSpinnerIncrement)
    })

    expect(lineItemUpdate).toHaveBeenCalledTimes(1)
    expect(lineItemUpdate).toHaveBeenLastCalledWith({
      id: 'Rew3423fwr',
      quantity: 3
    })

    await waitFor(() => {
      fireEvent.click(inputSpinnerDecrement)
    })

    expect(lineItemUpdate).toHaveBeenCalledTimes(2)
    expect(lineItemUpdate).toHaveBeenLastCalledWith({
      id: 'Rew3423fwr',
      quantity: 2
    })

    await waitFor(() => {
      fireEvent.click(deleteButton)
    })

    expect(lineItemDelete).toHaveBeenCalledTimes(1)
    expect(lineItemDelete).toHaveBeenLastCalledWith('Rew3423fwr')
  })
})

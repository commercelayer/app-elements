import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { FiltersNav } from './FiltersNav'
import { instructions } from './mockedInstructions'

describe('FiltersNav', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('should render filter nav buttons', () => {
    const { container, getByText } = render(
      <FiltersNav
        instructions={instructions}
        onFilterClick={() => {}}
        onUpdate={() => {}}
        queryString='?status_in=placed&status_in=approved&payment_status_eq=authorized&market_id_in=abc123&market_id_in=zxy456&market_id_in=xxx789'
        predicateWhitelist={[]}
      />
    )
    expect(container).toBeVisible()

    // grouped by status_in
    expect(getByText('Status · 2')).toBeVisible()
    // payment_status_eq is only one, so it should not be grouped
    expect(getByText('Authorized')).toBeVisible()
    // grouped by market_in, we have 3 markets
    expect(getByText('Markets · 3')).toBeVisible()
  })

  test('should render single resource name (relationship) when there is only 1 filter for relationship selected (InputResourceGroup component)', async () => {
    const { container, getByText } = render(
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <FiltersNav
            instructions={instructions}
            onFilterClick={() => {}}
            onUpdate={() => {}}
            queryString='?market_id_in=AlRevhXQga' // mocked in msw as Europe
            predicateWhitelist={[]}
          />
        </CoreSdkProvider>
      </TokenProvider>
    )
    expect(container).toBeVisible()

    // grouped by status_in
    await waitFor(() => {
      expect(getByText('Europe')).toBeVisible()
    })
  })

  test('should handle onFilterClick callback, returning current query string and clicked filter id', () => {
    const onFilterClick = vi.fn()

    const { getByText } = render(
      <FiltersNav
        instructions={instructions}
        onFilterClick={onFilterClick}
        onUpdate={() => {}}
        queryString='?status_in=placed&status_in=approved&payment_status_eq=authorized'
        predicateWhitelist={[]}
      />
    )

    fireEvent.click(getByText('Authorized'))
    expect(onFilterClick).toHaveBeenCalledWith(
      'payment_status_eq=authorized&status_in=placed&status_in=approved',
      'payment_status_eq'
    )
  })

  test('should handle onUpdate callback, returning current query string and clicked filter id', () => {
    const onUpdate = vi.fn()

    const { getAllByTestId } = render(
      <FiltersNav
        instructions={instructions}
        onFilterClick={() => {}}
        onUpdate={onUpdate}
        queryString='?status_in=placed&payment_status_eq=authorized'
        predicateWhitelist={[]}
      />
    )

    // expecting to find 3 remove buttons (all + status_in + payment_status_eq)
    const removeAllFiltersButton = getAllByTestId('ButtonFilter-remove')[0]
    const removeStatusButton = getAllByTestId('ButtonFilter-remove')[1]
    const removeAuthorizedButton = getAllByTestId('ButtonFilter-remove')[2]
    expect(removeAllFiltersButton).toBeVisible()
    expect(removeStatusButton).toBeVisible()
    expect(removeAuthorizedButton).toBeVisible()
    assertToBeDefined(removeAllFiltersButton)
    assertToBeDefined(removeStatusButton)

    // remove status_in filter, expecting that new query string only contains payment_status_eq
    fireEvent.click(removeStatusButton)
    expect(onUpdate).toHaveBeenCalledWith('payment_status_eq=authorized')

    onUpdate.mockReset()

    // remove all filters by clicking on remove all filters button
    fireEvent.click(removeAllFiltersButton)
    expect(onUpdate).toHaveBeenCalledWith('') // new query string is empty
  })
})

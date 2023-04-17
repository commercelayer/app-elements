import { render } from '@testing-library/react'
import { ButtonFilter } from './ButtonFilter'

describe('ButtonFilter', () => {
  const mockedConsoleLog = vi.spyOn(console, 'log')

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Should be rendered', () => {
    const { container } = render(<ButtonFilter label='Filter' />)
    expect(container).toBeVisible()
  })

  test('Should render only the main button', () => {
    const { getByTestId, queryByTestId } = render(
      <ButtonFilter
        label='Filter'
        onClick={() => {
          console.log('main-button-clicked')
        }}
      />
    )
    expect(getByTestId('ButtonFilter-main')).toBeVisible()
    expect(queryByTestId('ButtonFilter-remove')).toBe(null)
    getByTestId('ButtonFilter-main').click()
    expect(mockedConsoleLog).toHaveBeenCalledWith('main-button-clicked')
  })

  test('Should render optional remove button ', () => {
    const { getByTestId } = render(
      <ButtonFilter
        label='Filter'
        onRemoveRequest={() => {
          console.log('remove-request')
        }}
      />
    )
    expect(getByTestId('ButtonFilter-main')).toBeVisible()
    expect(getByTestId('ButtonFilter-remove')).toBeVisible()
    getByTestId('ButtonFilter-remove').click()
    expect(mockedConsoleLog).toHaveBeenCalledWith('remove-request')
  })

  test('Should render left icon when passed as prop', () => {
    const { getByTestId } = render(
      <ButtonFilter label='Filter' icon='funnel' />
    )
    expect(getByTestId('ButtonFilter-icon')).toBeVisible()
  })
})

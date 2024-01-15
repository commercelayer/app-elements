import { render } from '@testing-library/react'
import { ButtonCard } from './ButtonCard'
import { Text } from './Text'

describe('ButtonCard', () => {
  const mockedConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Should be rendered', () => {
    const { container } = render(
      <ButtonCard fullWidth icon='arrowDown' iconLabel='Download' />
    )
    expect(container).toBeVisible()
  })

  test('Should render only main content and icon', () => {
    const { getByTestId, queryByTestId } = render(
      <ButtonCard
        fullWidth
        icon='arrowCircleUp'
        padding='6'
        onClick={() => {
          console.log('main-button-clicked')
        }}
      >
        <Text align='left' variant='info'>
          <a>Set conditions</a> to limit the promotion to specific orders.
          <br />
          Promotion applies only if all conditions are met.
        </Text>
      </ButtonCard>
    )
    expect(getByTestId('ButtonCard-main')).toBeVisible()
    expect(getByTestId('ButtonCard-icon')).toBeVisible()
    expect(queryByTestId('ButtonCard-iconLabel')).toBe(null)
    getByTestId('ButtonCard-main').click()
    expect(mockedConsoleLog).toHaveBeenCalledWith('main-button-clicked')
  })

  test('Should render only iconLabel when passed as prop', () => {
    const { getByTestId } = render(<ButtonCard iconLabel='Add items' />)
    expect(getByTestId('ButtonCard-iconLabel')).toBeVisible()
  })
})

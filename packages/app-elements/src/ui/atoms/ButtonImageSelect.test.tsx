import { render } from '@testing-library/react'
import { ButtonImageSelect } from './ButtonImageSelect'

describe('ButtonImageSelect', () => {
  const mockedConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Should be rendered', () => {
    const { container } = render(<ButtonImageSelect />)
    expect(container).toBeVisible()
  })

  test('Should render with image', () => {
    const { getByTestId } = render(
      <ButtonImageSelect
        src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png'
        onClick={() => {
          console.log('main-button-clicked')
        }}
      />
    )
    expect(getByTestId('ButtonImageSelect-main')).toContainElement(
      getByTestId('ButtonImageSelect-image')
    )
    getByTestId('ButtonImageSelect-main').click()
    expect(mockedConsoleLog).toHaveBeenCalledWith('main-button-clicked')
  })
})

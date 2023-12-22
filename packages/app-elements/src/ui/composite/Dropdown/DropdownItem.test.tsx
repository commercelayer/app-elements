import { fireEvent, render } from '@testing-library/react'
import { DropdownItem } from './DropdownItem'

describe('DropdownItem', () => {
  const mockedOnClick = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Should render with width default options as button', () => {
    const { getByText, container } = render(
      <DropdownItem label='Edit item' onClick={mockedOnClick} />
    )
    const element = container.firstElementChild
    assertToBeDefined(element)
    expect(element.tagName).toBe('BUTTON')
    expect(getByText('Edit item')).toBeVisible()
    expect(mockedOnClick).toHaveBeenCalledTimes(0)
  })

  test('Should handle onClick event', () => {
    const { getByText } = render(
      <DropdownItem label='Edit item' onClick={mockedOnClick} />
    )
    expect(getByText('Edit item')).toBeVisible()
    fireEvent.click(getByText('Edit item'))
    expect(mockedOnClick).toHaveBeenCalledTimes(1)
  })

  test('Should be rendered as anchor when used with href', () => {
    const { container, getByText } = render(
      <DropdownItem
        label='Visit documentation'
        href='https://commercelayer.io/'
        target='_blank'
      />
    )
    const element = container.firstElementChild
    assertToBeDefined(element)
    expect(getByText('Visit documentation')).toBeVisible()
    expect(element.tagName).toBe('A')
    expect(element.getAttribute('href')).toBe('https://commercelayer.io/')
    expect(element.getAttribute('target')).toBe('_blank')
  })
})

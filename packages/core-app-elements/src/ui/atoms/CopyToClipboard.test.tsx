import { CopyToClipboard } from './CopyToClipboard'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  value: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, value }: SetupProps): SetupResult => {
  const utils = render(<CopyToClipboard data-test-id={id} value={value} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('CopyToClipboard', () => {
  test('Should be rendered with copy button', () => {
    const { element, getByText, getByTestId } = setup({
      id: 'my-value',
      value: 'ABCD1234'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('ABCD1234')).toBeInTheDocument()
    expect(getByTestId('copy-value-button')).toBeInTheDocument()
  })

  test('Should display a dash and no button when value is empty or undefined', () => {
    const { element, getByText } = setup({
      id: 'my-value',
      value: ''
    })
    expect(element).toBeInTheDocument()
    expect(getByText('-')).toBeInTheDocument()
    expect(element.querySelector('[data-test-id="copy-value-button"]')).toBe(
      null
    )
  })
})

describe('CopyToClipboard click', () => {
  // mocking clipboard
  const initialClipboard = { ...global.navigator.clipboard }
  beforeEach(() => {
    let clipboardValue = ''
    ;(global.navigator as any).clipboard = {
      writeText: vi.fn((text: string) => {
        clipboardValue = text
      }),
      readText: vi.fn(() => {
        return clipboardValue
      })
    }
  })

  afterEach(() => {
    vi.resetAllMocks()
    ;(global.navigator as any) = initialClipboard
  })

  test('Should copy text into clipboard', () => {
    const value = 'BEANIEXXFFFFFF000000XXXX'
    const { element, getByTestId } = setup({
      id: 'my-value',
      value
    })
    expect(element).toBeInTheDocument()
    const copyBtn = getByTestId('copy-value-button')
    expect(navigator.clipboard.readText()).toBe('')

    copyBtn.click()
    expect(navigator.clipboard.writeText).toBeCalledTimes(1)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value)
    expect(navigator.clipboard.readText()).toBe(value)
  })
})

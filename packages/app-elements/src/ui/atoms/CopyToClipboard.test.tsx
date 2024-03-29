import {
  fireEvent,
  render,
  waitFor,
  type RenderResult
} from '@testing-library/react'
import { CopyToClipboard } from './CopyToClipboard'

interface SetupProps {
  id: string
  value: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, value }: SetupProps): SetupResult => {
  const utils = render(<CopyToClipboard data-testid={id} value={value} />)
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
    const { element, getByTestId } = setup({
      id: 'my-value',
      value: ''
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('empty-string')).toBeInTheDocument()
    expect(element.querySelector('[data-testid="copy-value-button"]')).toBe(
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

  test('Should copy text into clipboard', async () => {
    const value = 'BEANIEXXFFFFFF000000XXXX'

    const { container, getByTestId } = render(
      <CopyToClipboard data-testid='my-value' value={value} />
    )

    expect(container).toBeInTheDocument()
    expect(navigator.clipboard.readText()).toBe('')

    fireEvent.click(getByTestId('copy-value-button'))
    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(navigator.clipboard.writeText).toBeCalledTimes(1)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value)
      expect(navigator.clipboard.readText()).toBe(value)
    })
  })
})

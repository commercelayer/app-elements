import { fireEvent, render, type RenderResult } from '@testing-library/react'
import { InputJson, type InputJsonProps } from './InputJson'

interface SetupProps extends InputJsonProps<any> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<InputJson data-testid={id} {...rest} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputJson', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'my-input-json',
      onDataReady: () => undefined,
      onDataResetRequest: () => undefined,
      placeholder: { foo: 'bar' },
      validateFn: (v) => v
    })
    const textarea = element.getElementsByTagName('textarea')[0]
    expect(element).toBeInTheDocument()
    expect(textarea).toBeInTheDocument()
    expect(textarea.getAttribute('placeholder')).toBe(
      'Example: \n{\n  "foo": "bar"\n}'
    )
  })

  test('Should show on error on invalid JSON', () => {
    const { element, getByTestId } = setup({
      id: 'my-input-json',
      onDataReady: () => undefined,
      onDataResetRequest: () => undefined,
      placeholder: { foo: 'bar' },
      validateFn: (v) => v
    })
    const textarea = element.getElementsByTagName('textarea')[0]
    fireEvent.change(textarea, { target: { value: '[{ invalidJson: hello}]' } })
    expect(getByTestId('input-feedback').innerHTML).toContain('Invalid JSON')
  })

  test('Should execute `onDataReady` callback when JSON is valid', () => {
    const onDataReadyMock = vi.fn()

    const { element } = setup({
      id: 'my-input-json',
      onDataReady: onDataReadyMock,
      onDataResetRequest: () => undefined,
      placeholder: { foo: 'bar' },
      validateFn: (v) => v
    })

    const textarea = element.getElementsByTagName('textarea')[0]
    fireEvent.change(textarea, { target: { value: '{"foo": "bar"}' } })
    expect(onDataReadyMock).toBeCalledTimes(1)
    expect(onDataReadyMock).toHaveBeenCalledWith({ foo: 'bar' })
  })
})

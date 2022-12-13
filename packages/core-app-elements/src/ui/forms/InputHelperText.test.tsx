import { InputHelperText, InputHelperTextProps } from './InputHelperText'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps extends Omit<InputHelperTextProps, 'children'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(
    <InputHelperText data-test-id={id} {...rest}>
      This is an helper text.
    </InputHelperText>
  )
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputHelperText', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'my-helper-text' })
    expect(element).toBeInTheDocument()
  })

  test('Should show an icon', () => {
    const { element, getByTestId } = setup({
      id: 'my-helper-text-with-bulb',
      icon: 'bulb'
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('icon-bulb')).toBeInTheDocument()
  })
})

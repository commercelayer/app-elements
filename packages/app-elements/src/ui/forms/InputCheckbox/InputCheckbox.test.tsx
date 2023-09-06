import { InputCheckbox } from './InputCheckbox'
import { render, type RenderResult, fireEvent } from '@testing-library/react'
import { useState } from 'react'

interface SetupProps {
  checked?: boolean
}

type SetupResult = RenderResult & {
  wrapper: HTMLElement
  label: HTMLLabelElement
  input: HTMLInputElement
}

const Component = ({ checked }: SetupProps): JSX.Element => {
  const [state, setState] = useState(checked)
  return (
    <InputCheckbox
      checked={state}
      onChange={(e) => {
        setState(e.target.checked)
      }}
    >
      Check me
    </InputCheckbox>
  )
}

const setup = ({ checked }: SetupProps): SetupResult => {
  const utils = render(<Component checked={checked} />)
  const wrapper = utils.getByTestId('checkbox-wrapper')
  const input = utils.getByTestId('checkbox-input') as HTMLInputElement
  const label = utils.getByTestId('checkbox-label') as HTMLLabelElement
  return {
    wrapper,
    input,
    label,
    ...utils
  }
}

describe('InputCheckbox', () => {
  test('Should be rendered', () => {
    const { wrapper, input } = setup({})
    expect(wrapper).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  test('Should update checked value', () => {
    const { input } = setup({})
    expect(input.checked).toBe(false)
    fireEvent.click(input)
    expect(input.checked).toBe(true)
  })

  test('Should accept initial checked value', () => {
    const { input } = setup({ checked: true })
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })

  test('Should be controlled on label', () => {
    const { label, input } = setup({})
    fireEvent.click(label)
    expect(input.checked).toBe(true)
    fireEvent.click(label)
    expect(input.checked).toBe(false)
  })
})

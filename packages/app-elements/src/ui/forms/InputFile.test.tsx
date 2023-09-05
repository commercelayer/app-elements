import { render, type RenderResult } from '@testing-library/react'
import { InputFile } from './InputFile'

interface SetupProps {
  id: string
  label: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, label }: SetupProps): SetupResult => {
  const utils = render(<InputFile data-testid={id} label={label} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('InputFile', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup({
      id: 'some-label',
      label: 'Upload your avatar'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('Upload your avatar')).toBeInTheDocument()
  })

  test('Should render an input type=file', () => {
    const { element } = setup({
      id: 'some-label',
      label: 'Upload your avatar'
    })
    expect(element.getAttribute('type')).toBe('file')
  })
})

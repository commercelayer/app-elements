import { InputFile } from './InputFile'
import { render, RenderResult } from '@testing-library/react'
import { testInvariant } from '#utils/tests'

interface SetupProps {
  id: string
  label: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, label }: SetupProps): SetupResult => {
  const utils = render(<InputFile data-test-id={id} label={label} />)
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

  test('Should throw error if progress is not in 0-100 range', () => {
    testInvariant(() => {
      render(<InputFile label='This will break' progress={101} />)
    }, 'When set, progress must be between 0 and 100 range')

    testInvariant(() => {
      // @ts-expect-error
      render(<InputFile label='This will break' progress='50%' />)
    }, 'When set, progress must be between 0 and 100 range')
  })
})

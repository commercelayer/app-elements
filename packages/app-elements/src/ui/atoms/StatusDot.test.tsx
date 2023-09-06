import { render, type RenderResult } from '@testing-library/react'
import { setVerbosity } from 'ts-invariant'
import { StatusDot, type StatusDotProps } from './StatusDot'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ variant }: StatusDotProps): SetupResult => {
  setVerbosity('silent')
  const utils = render(<StatusDot data-testid='element' variant={variant} />)
  const element = utils.getByTestId('element')
  return {
    element,
    ...utils
  }
}

describe('StatusDot', () => {
  test('Should be rendered', () => {
    const { element } = setup({ variant: 'success' })
    expect(element).toBeInTheDocument()
    expect(element.className).toContain('bg-green')
  })
})

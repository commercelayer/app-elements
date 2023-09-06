import { render, type RenderResult } from '@testing-library/react'
import { Legend } from './Legend'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(
    <Legend
      data-testid='my-legend'
      title='Hello world'
      actionButton={<button>Click me</button>}
    />
  )
  const element = utils.getByTestId('my-legend')
  return {
    element,
    ...utils
  }
}

describe('Legend', () => {
  test('Should be rendered', () => {
    const { element } = setup()
    expect(element).toBeInTheDocument()
  })
})

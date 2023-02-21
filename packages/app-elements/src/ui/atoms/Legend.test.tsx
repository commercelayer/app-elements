import { Legend } from './Legend'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(
    <Legend
      data-test-id='my-legend'
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

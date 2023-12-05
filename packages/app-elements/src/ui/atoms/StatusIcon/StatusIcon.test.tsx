import { render, type RenderResult } from '@testing-library/react'
import { StatusIcon } from './StatusIcon'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(<StatusIcon data-testid='my-icon' name='arrowLeft' />)
  const element = utils.getByTestId('my-icon')
  return {
    element,
    ...utils
  }
}

describe('StatusIcon', () => {
  test('Should be rendered', () => {
    const { element } = setup()
    expect(element).toBeVisible()
  })
})

import { render, type RenderResult } from '@testing-library/react'
import { Icon } from './Icon'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(<Icon data-testid='my-icon' name='arrowLeft' />)
  const element = utils.getByTestId('my-icon')
  return {
    element,
    ...utils
  }
}

describe('Icon', () => {
  test('Should be rendered', () => {
    const { element } = setup()
    expect(element).toBeVisible()
  })
})

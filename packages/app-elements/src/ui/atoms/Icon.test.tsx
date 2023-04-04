import { Icon } from './Icon'
import { render, type RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(<Icon data-test-id='my-icon' name='arrowLeft' />)
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

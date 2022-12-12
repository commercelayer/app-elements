import { PageLayout } from './PageLayout'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(
    <PageLayout data-test-id='my-page' title='Page title'>
      <div>Content...</div>
    </PageLayout>
  )
  const element = utils.getByTestId('my-page')
  return {
    element,
    ...utils
  }
}

describe('PageLayout', () => {
  test('Should be rendered', () => {
    const { element } = setup()
    expect(element).toBeInTheDocument()
  })
})

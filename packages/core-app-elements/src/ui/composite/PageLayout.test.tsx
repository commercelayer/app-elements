import { PageLayout } from './PageLayout'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ isTestMode }: { isTestMode?: boolean }): SetupResult => {
  const utils = render(
    <PageLayout
      data-test-id='my-page'
      title='Page title'
      isTestMode={isTestMode}
    >
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
    const { element } = setup({})
    expect(element).toBeInTheDocument()
    expect(element).toMatchSnapshot()
  })

  test('Should render test mode badge', () => {
    const { getByText } = setup({ isTestMode: true })
    expect(getByText('TEST DATA')).toBeInTheDocument()
  })
})

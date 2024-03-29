import { render, type RenderResult } from '@testing-library/react'
import { PageError } from './PageError'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(
    <PageError
      data-testid='my-error-page'
      pageTitle='Commerce Layer App'
      errorName='Not found'
      errorDescription='We could not find the resource you are looking for.'
    />
  )
  const element = utils.getByTestId('my-error-page')
  return {
    element,
    ...utils
  }
}

describe('PageError', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup()
    expect(element).toBeInTheDocument()
    expect(getByText('Commerce Layer App')).toBeInTheDocument()
    expect(getByText('Not found')).toBeInTheDocument()
    expect(
      getByText('We could not find the resource you are looking for.')
    ).toBeInTheDocument()
  })
})

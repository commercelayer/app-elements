import { render, type RenderResult } from '@testing-library/react'
import { Pagination, type PaginationProps } from './Pagination'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: PaginationProps): SetupResult => {
  const utils = render(<Pagination data-testid='my-pagination' {...props} />)
  const element = utils.getByTestId('my-pagination')
  return {
    element,
    ...utils
  }
}

describe('Pagination', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      currentPage: 1,
      onChangePageRequest: () => undefined,
      pageCount: 10
    })
    expect(element).toBeInTheDocument()
  })

  test('Should be rendered as disabled', () => {
    const { element } = setup({
      currentPage: 1,
      onChangePageRequest: () => undefined,
      pageCount: 10,
      isDisabled: true
    })
    expect(element).toBeInTheDocument()
    expect(element.className).toContain('opacity-')
  })
})

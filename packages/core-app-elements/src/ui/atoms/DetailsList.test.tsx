import { DetailsList, DetailsListProps } from './DetailsList'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps extends DetailsListProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<DetailsList data-test-id={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('DetailsList', () => {
  test('Should render', () => {
    const { element } = setup({
      id: 'my-details-list'
    })
    expect(element).toBeVisible()
  })

  test('Should render a title', () => {
    const { getByTestId } = setup({
      id: 'my-details-list',
      title: 'Lorem ipsum'
    })
    expect(getByTestId('details-list-title')).toBeVisible()
    expect(getByTestId('details-list-title').innerHTML).toBe('Lorem ipsum')
  })

  test('Should display `isLoading` state with the specified number of `loadingLines`', () => {
    const { element, getByTestId } = setup({
      id: 'my-details-list',
      title: 'Lorem ipsum',
      isLoading: true,
      loadingLines: 10
    })
    expect(element).toBeVisible()
    expect(getByTestId('details-list-loading-rows')?.childNodes?.length).toBe(
      10
    )
    expect(
      element.querySelector("[data-test-id='details-list-rows']")
    ).not.toBeInTheDocument()
  })
})

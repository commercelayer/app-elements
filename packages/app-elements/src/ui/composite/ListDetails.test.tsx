import { render, type RenderResult } from '@testing-library/react'
import { ListDetails, type DetailsListProps } from './ListDetails'

interface SetupProps extends DetailsListProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<ListDetails data-testid={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('ListDetails', () => {
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
    expect(getByTestId('details-list-title')).toHaveTextContent('Lorem ipsum')
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
      element.querySelector("[data-testid='details-list-rows']")
    ).not.toBeInTheDocument()
  })
})
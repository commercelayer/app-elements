import { EmptyState } from './EmptyState'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  title: string
  description?: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<EmptyState data-test-id={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('EmptyState', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup({
      id: 'my-element',
      title: 'Your list is empty'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('Your list is empty')).toBeInTheDocument()
  })

  test('Should render optional description ', () => {
    const { element, getByText } = setup({
      id: 'my-element',
      title: 'Your list is empty',
      description: 'Lorem impsum'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('Your list is empty')).toBeInTheDocument()
    expect(getByText('Lorem impsum')).toBeInTheDocument()
  })
})

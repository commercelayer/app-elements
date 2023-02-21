import { render, RenderResult } from '@testing-library/react'
import { PageHeading, PageHeadingProps } from './PageHeading'

interface SetupProps extends PageHeadingProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<PageHeading data-test-id={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('PageHeading', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'heading', title: 'My Page Heading' })
    expect(element.querySelector('h1')?.innerHTML).toBe('My Page Heading')
  })

  test('Should also render optional description', () => {
    const { element } = setup({
      id: 'heading',
      title: 'My Page Heading',
      description: 'Lorem ipsum...'
    })
    expect(element.querySelector('div')?.innerHTML).toBe('Lorem ipsum...')
  })

  test('Should also render optional badge', () => {
    const { getByTestId } = setup({
      id: 'heading-w-badge',
      title: 'My Page Heading',
      badgeVariant: 'success',
      badgeLabel: 'TEST DATA'
    })
    const badgeElement = getByTestId('page-heading-badge')
    expect(badgeElement).toBeInTheDocument()
    expect(
      badgeElement.querySelector('.text-green.bg-green\\/10')
    ).toBeInTheDocument()
  })

  test('Should also have a button when onGoBack is set', () => {
    const foo: string[] = []
    const { element } = setup({
      id: 'heading',
      title: 'My Page Heading',
      description: 'Lorem ipsum...',
      onGoBack: () => {
        foo.push('bar')
      }
    })
    expect(element.querySelector('button')).toBeVisible()
    element.querySelector('button')?.click()
    expect(foo.includes('bar')).toBe(true)
  })
})

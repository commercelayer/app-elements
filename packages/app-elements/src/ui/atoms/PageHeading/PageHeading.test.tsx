import { render, type RenderResult } from '@testing-library/react'
import { PageHeading, type PageHeadingProps } from './PageHeading'

interface SetupProps extends PageHeadingProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<PageHeading data-testid={id} {...rest} />)
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
    const { getByText } = setup({
      id: 'heading',
      title: 'My Page Heading',
      description: 'Lorem ipsum...'
    })
    expect(getByText('Lorem ipsum...')).toBeVisible()
  })

  test('Should also render optional badge', () => {
    const { getByTestId } = setup({
      id: 'heading-w-badge',
      title: 'My Page Heading',
      badge: { label: 'TEST DATA', variant: 'success' }
    })
    const badgeElement = getByTestId('page-heading-badge')
    expect(badgeElement).toBeInTheDocument()
    expect(
      badgeElement.querySelector('.text-green-600.bg-green-50')
    ).toBeInTheDocument()
  })

  test('Should also have a button when navigationButton is set', () => {
    const foo: string[] = []
    const { element } = setup({
      id: 'heading',
      title: 'My Page Heading',
      description: 'Lorem ipsum...',
      navigationButton: {
        label: 'Go back',
        onClick: () => foo.push('bar')
      }
    })
    expect(element.querySelector('button')).toBeVisible()
    element.querySelector('button')?.click()
    expect(foo.includes('bar')).toBe(true)
  })
})

describe('PageHeading gap', () => {
  test('Should have gap top and bottom', () => {
    const { element } = setup({
      id: 'heading',
      title: 'My Page Heading'
    })
    expect(element).toHaveClass('pt-5 md:pt-10 pb-6 md:pb-14')
  })

  test('Should have gap only on top', () => {
    const { element } = setup({
      id: 'heading',
      title: 'My Page Heading',
      gap: 'only-top'
    })
    expect(element).toHaveClass('pt-5 md:pt-10')
    expect(element).not.toHaveClass('pb-6 md:pb-14')
  })

  test('Should have no vertical gap', () => {
    const { element } = setup({
      id: 'heading',
      title: 'My Page Heading',
      gap: 'none'
    })
    expect(element.classList.toString()).toBe('w-full')
  })
})

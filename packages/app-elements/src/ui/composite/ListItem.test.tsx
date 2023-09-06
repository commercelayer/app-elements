import { render, type RenderResult } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { ListItem, type ListItemProps } from './ListItem'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListItemProps): SetupResult => {
  const utils = render(<ListItem data-testid='my-item' {...props} />)
  const element = utils.getByTestId('my-item')
  return {
    element,
    ...utils
  }
}

describe('ListItem', () => {
  test('Should be rendered as div', async () => {
    const onClick = vi.fn()
    const { element } = setup({
      tag: 'div',
      onClick,
      children: <div>Content</div>
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
    act(() => {
      element.click()
    })
    expect(onClick).toBeCalledTimes(1)
  })

  test('Should be rendered as anchor', () => {
    const { element } = setup({
      tag: 'a',
      href: 'https://www.commercelayer.io',
      children: <div>Content</div>
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe('A')
    expect(element.getAttribute('href')).toBe('https://www.commercelayer.io')
    expect(element).toHaveClass('cursor-pointer', 'hover:bg-gray-50')
  })

  test('Should not have hover effect when href is not set', () => {
    const { element } = setup({
      tag: 'a',
      children: <div>Content</div>
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe('A')
    expect(element).not.toHaveClass('cursor-pointer', 'hover:bg-gray-50')
  })

  test('Should not be rendered with `tag` as attribute', () => {
    // this should never happen <div tag="div" /> | <a tag="a" />
    const { element } = setup({
      tag: 'div',
      children: <div>Content</div>
    })
    expect(element).toBeInTheDocument()
    expect(element.getAttribute('tag')).toBe(null)
  })
})

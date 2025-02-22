import { render, type RenderResult } from '@testing-library/react'
import { Text, type TextProps } from './Text'

interface SetupProps {
  variant?: TextProps['variant']
  tag?: 'span' | 'div'
  className?: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ variant, tag, className }: SetupProps): SetupResult => {
  const utils = render(
    <Text
      data-testid='my-text'
      tag={tag}
      variant={variant}
      className={className}
    >
      Lorem ipsum
    </Text>
  )
  const element = utils.getByTestId('my-text')
  return {
    element,
    ...utils
  }
}

describe('Text', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup({})
    expect(element).toBeInTheDocument()
    expect(getByText('Lorem ipsum')).toBeInTheDocument()
    expect(element.tagName).toBe('SPAN')
  })

  test('Should be as div', () => {
    const { element } = setup({ tag: 'div', variant: 'success' })
    expect(element.tagName).toBe('DIV')
  })

  test('Should render a danger variant', () => {
    const { element } = setup({ variant: 'danger' })
    expect(element.className).toContain('text-red')
  })

  test('Should render a success variant', () => {
    const { element } = setup({ variant: 'success' })
    expect(element.className).toContain('text-green-600')
  })

  test('Should render a primary variant', () => {
    const { element } = setup({ variant: 'primary' })
    expect(element.className).toContain('text-primary')
  })

  test('Should accept custom className', () => {
    const { element } = setup({ className: 'my-custom-css' })
    expect(element.className).toContain('my-custom-css')
  })
})

import { render, RenderResult } from '@testing-library/react'
import { Button, ButtonSize, ButtonVariant } from './Button'

interface SetupProps {
  id: string
  text: string
  variant?: ButtonVariant
  size?: ButtonSize
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, variant, size, text }: SetupProps): SetupResult => {
  const utils = render(
    <Button data-test-id={id} variant={variant} size={size}>
      {text}
    </Button>
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Button', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'clickme', text: 'click me' })
    expect(element.innerHTML).toBe('click me')
    expect(element.tagName).toBe('BUTTON')
  })

  test('Should render as primary variant', () => {
    const { element } = setup({ id: 'primary', text: 'Primary variant' })
    expect(element.className).toContain('bg-black')
    expect(element.className).toContain('text-white')
  })

  test('Should render as secondary variant', () => {
    const { element } = setup({
      id: 'secondary',
      variant: 'secondary',
      text: 'Secondary variant'
    })
    expect(element.className).toContain('bg-white')
    expect(element.className).toContain('text-black')
    expect(element.className).toContain('border border-gray-300')
  })

  test('Should render as danger variant', () => {
    const { element } = setup({
      id: 'danger',
      variant: 'danger',
      text: 'Danger variant'
    })
    expect(element.className).toContain('bg-white')
    expect(element.className).toContain('text-red')
    expect(element.className).toContain('border border-red')
  })

  test('Should render as size small', () => {
    const { element } = setup({
      id: 'danger',
      size: 'small',
      text: 'Small button'
    })
    expect(element.className).toContain('px-6 py-2')
  })

  test('Should render as size regular (default)', () => {
    const { element } = setup({
      id: 'danger',
      text: 'Regular button'
    })
    expect(element.className).toContain('px-6 py-3')
  })

  test('Should render as size large', () => {
    const { element } = setup({
      id: 'danger',
      size: 'large',
      text: 'Large button'
    })
    expect(element.className).toContain('px-8 py-4')
  })
})

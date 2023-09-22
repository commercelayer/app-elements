import { render, type RenderResult } from '@testing-library/react'
import { Badge, type BadgeVariant } from './Badge'

interface SetupProps {
  id: string
  children: string
  variant: BadgeVariant
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<Badge data-testid={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Badge', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'my-badge',
      children: 'Completed',
      variant: 'success'
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
    expect(element.innerHTML).toBe('Completed')
  })
})

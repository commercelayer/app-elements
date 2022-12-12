import { Badge, BadgeVariant } from './Badge'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  label: string
  variant: BadgeVariant
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<Badge data-test-id={id} {...rest} />)
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
      label: 'Completed',
      variant: 'success'
    })
    expect(element).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
    expect(element.innerHTML).toBe('Completed')
  })
})

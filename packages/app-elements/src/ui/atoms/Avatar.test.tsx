import { render, type RenderResult } from '@testing-library/react'
import { Avatar, type AvatarProps } from './Avatar'

interface SetupProps extends AvatarProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...props }: SetupProps): SetupResult => {
  const utils = render(<Avatar data-testid={id} {...props} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Avatar', () => {
  test('Should be rendered with src pointing to an https url', () => {
    const { element } = setup({
      id: 'avatar',
      src: 'https://i2.wp.com/ui-avatars.com/api/Commerce+Layer/160/FF656B/FFFFFF/2/0.33/true/true/true?ssl=1',
      alt: 'Commerce Layer logo'
    })
    expect(element).toBeVisible()
    expect(element).toMatchSnapshot()
    expect(element.getAttribute('src')).toBe(
      'https://i2.wp.com/ui-avatars.com/api/Commerce+Layer/160/FF656B/FFFFFF/2/0.33/true/true/true?ssl=1'
    )
    expect(element.getAttribute('alt')).toBe('Commerce Layer logo')
  })

  test('Should be rendered with src pointing to a preset', () => {
    const { element } = setup({
      id: 'avatar',
      src: 'payments:stripe',
      alt: 'Stripe'
    })
    expect(element).toBeVisible()
    expect(element).toMatchSnapshot()
    expect(element.getAttribute('src')).toContain('data:image/')
    expect(element.getAttribute('alt')).toBe('Stripe')
  })
})

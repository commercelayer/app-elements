import { render, type RenderResult } from '@testing-library/react'
import { Avatar, type AvatarProps } from './Avatar'

interface SetupProps extends AvatarProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...props }: SetupProps): SetupResult => {
  const utils = render(<Avatar data-test-id={id} {...props} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Avatar', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'avatar',
      src: 'https://i2.wp.com/ui-avatars.com/api/Commerce+Layer/160/FF656B/FFFFFF/2/0.33/true/true/true?ssl=1',
      alt: 'Commerce Layer logo'
    })
    expect(element).toBeVisible()
    expect(element).toMatchSnapshot()
    expect(element.getAttribute('alt')).toBe('Commerce Layer logo')
  })
})

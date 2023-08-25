import { render } from '@testing-library/react'
import { A } from './A'

describe('Anchor', () => {
  test('Should be rendered', () => {
    const { getByRole } = render(
      <A href='https://commercelayer.io'>My anchor tag</A>
    )

    const a = getByRole('link')
    expect(a).toBeVisible()
    expect(a.innerHTML).toBe('My anchor tag')
    expect(a.tagName).toBe('A')
    expect(a).toBeInstanceOf(HTMLAnchorElement)
    expect(a.getAttribute('href')).toBe('https://commercelayer.io')
  })
})

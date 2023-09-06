import { render, type RenderResult } from '@testing-library/react'
import { type ReactNode } from 'react'
import { ListDetailsItem } from './ListDetailsItem'

interface SetupProps {
  id: string
  label: string
  children: ReactNode
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<ListDetailsItem data-testid={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('ListDetailsItem', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup({
      id: 'my-detail',
      label: 'Foo',
      children: <div>Bar</div>
    })
    expect(element).toBeVisible()
    expect(getByText('Foo')).toBeVisible()
    expect(getByText('Bar')).toBeVisible()
  })
})

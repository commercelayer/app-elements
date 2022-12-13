import { ListSimpleItem } from './ListSimpleItem'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ label }: { label: string }): SetupResult => {
  const utils = render(
    <ListSimpleItem data-test-id='my-list-item' label={label} />
  )
  const element = utils.getByTestId('my-list-item')
  return {
    element,
    ...utils
  }
}

describe('ListSimpleItem', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup({ label: 'Item #1' })
    expect(element).toBeInTheDocument()
    expect(getByText('Item #1')).toBeInTheDocument()
    expect(element.tagName).toBe('A')
  })
})

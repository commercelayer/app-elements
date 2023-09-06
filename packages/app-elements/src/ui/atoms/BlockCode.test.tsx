import { render, type RenderResult } from '@testing-library/react'
import { BlockCode } from './BlockCode'

interface SetupProps {
  id: string
  json?: object
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, json }: SetupProps): SetupResult => {
  const utils = render(<BlockCode data-testid={id} json={json} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('BlockCode', () => {
  test('Should be rendered', () => {
    const json = {
      foo: 'bar',
      hello: 'world'
    }
    const { element } = setup({
      id: 'my-code',
      json
    })
    expect(element).toBeInTheDocument()
    expect(JSON.parse(element.innerHTML)).toMatchObject(json)
    expect(element.innerHTML).toBe(`{\n  "foo": "bar",\n  "hello": "world"\n}`)
  })

  test('Should be a dash when no json is passed', () => {
    const { element } = setup({
      id: 'my-code',
      json: undefined
    })
    expect(element).toMatchSnapshot()
  })
})

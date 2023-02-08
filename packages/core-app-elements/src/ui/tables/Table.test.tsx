import { render, RenderResult } from '@testing-library/react'
import Table from './Table'
import { Tr, Th, Td } from '#ui/atoms/tables'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const tHead = (
    <Tr>
      <Th>Name</Th>
      <Th>Surname</Th>
    </Tr>
  )

  const tBody = (
    <>
      <Tr>
        <Td>John</Td>
        <Td>Mayer</Td>
      </Tr>
      <Tr>
        <Td>Eddie</Td>
        <Td>Van Halen</Td>
      </Tr>
      <Tr>
        <Td>Ben</Td>
        <Td>Harper</Td>
      </Tr>
    </>
  )

  const utils = render(
    <Table data-test-id='my-table' thead={tHead} tbody={tBody} />
  )
  const element = utils.getByTestId('my-table')
  return {
    element,
    ...utils
  }
}

describe('Table', () => {
  test('Should be rendered', () => {
    const { element } = setup()
    expect(element).toBeInTheDocument()
    expect(element.getElementsByTagName('thead')).toHaveLength(1)
    expect(element.getElementsByTagName('tbody')).toHaveLength(1)
    expect(element.getElementsByTagName('tr')).toHaveLength(4)
    expect(element.getElementsByTagName('th')).toHaveLength(2)
    expect(element.getElementsByTagName('td')).toHaveLength(6)
  })
})

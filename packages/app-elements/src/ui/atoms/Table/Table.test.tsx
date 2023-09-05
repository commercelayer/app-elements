import { Td, Th, Tr } from '#ui/atoms/Table'
import { render } from '@testing-library/react'
import { Table } from './Table'

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

describe('Table', () => {
  test('Should be rendered', () => {
    const { getByRole } = render(<Table thead={tHead} tbody={tBody} />)

    const element = getByRole('table')
    expect(element).toBeInTheDocument()
    expect(element.getElementsByTagName('thead')).toHaveLength(1)
    expect(element.getElementsByTagName('tbody')).toHaveLength(1)
    expect(element.getElementsByTagName('tr')).toHaveLength(4)
    expect(element.getElementsByTagName('th')).toHaveLength(2)
    expect(element.getElementsByTagName('td')).toHaveLength(6)
  })
})

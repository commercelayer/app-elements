import { render, RenderResult } from '@testing-library/react'
import { Table, TableCell, TableRow } from './Table'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const tHead = (
    <TableRow variant='th'>
      <TableCell variant='th'>Name</TableCell>
      <TableCell variant='th'>Surname</TableCell>
    </TableRow>
  )

  const tBody = (
    <>
      <TableRow>
        <TableCell>John</TableCell>
        <TableCell>Mayer</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Eddie</TableCell>
        <TableCell>Van Halen</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Ben</TableCell>
        <TableCell>Harper</TableCell>
      </TableRow>
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

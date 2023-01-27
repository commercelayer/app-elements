import { Table, TableCell, TableRow } from '#core-app-elements/tables/Table'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Table> = {
  title: 'Tables/Table',
  component: Table,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Table> = () => {
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

  return (
    <Container>
      <Table thead={tHead} tbody={tBody} />
    </Container>
  )
}

export const Default = Template.bind({})

const TemplateWithoutThead: ComponentStory<typeof Table> = () => {
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

  return (
    <Container>
      <Table tbody={tBody} />
    </Container>
  )
}

export const WithoutThead = TemplateWithoutThead.bind({})

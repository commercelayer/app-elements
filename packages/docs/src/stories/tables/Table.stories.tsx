import Table from '#core-app-elements/tables/Table'
import { Tr, Th, Td } from '#core-app-elements/atoms/tables'
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

  return (
    <Container>
      <Table tbody={tBody} />
    </Container>
  )
}

export const WithoutThead = TemplateWithoutThead.bind({})

import { Td, Th, Tr } from '#ui/atoms/tables'
import { Table } from '#ui/tables/Table'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof Table> = {
  title: 'Tables/Table',
  component: Table,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Table> = (args) => {
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

  return <Table thead={tHead} tbody={tBody} {...args} />
}

export const Default = Template.bind({})

const TemplateWithoutThead: ComponentStory<typeof Table> = (args) => {
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

  return <Table tbody={tBody} {...args} />
}

export const WithoutThead = TemplateWithoutThead.bind({})

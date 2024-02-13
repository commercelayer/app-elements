import { Icon } from '#ui/atoms/Icon'
import { Table, Td, Th, Tr } from '#ui/atoms/Table'
import { Dropdown, DropdownItem } from '#ui/composite/Dropdown'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Table> = {
  title: 'Atoms/Table',
  component: Table,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Table> = (args) => {
  return <Table {...args} />
}

export const Default = Template.bind({})
Default.args = {
  thead: (
    <Tr>
      <Th>Name</Th>
      <Th>Surname</Th>
    </Tr>
  ),
  tbody: (
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
}

const Menu = (
  <Dropdown
    dropdownLabel={<Icon name='dotsThree' size={24} />}
    dropdownItems={[
      <DropdownItem key='delete' label='Delete' onClick={() => {}} />
    ]}
  />
)

export const WithActions = Template.bind({})
WithActions.args = {
  thead: (
    <Tr>
      <Th>Name</Th>
      <Th>Surname</Th>
      <Th />
    </Tr>
  ),
  tbody: (
    <>
      <Tr>
        <Td>John</Td>
        <Td>Mayer</Td>
        <Td align='right'>{Menu}</Td>
      </Tr>
      <Tr>
        <Td>Eddie</Td>
        <Td>Van Halen</Td>
        <Td align='right'>{Menu}</Td>
      </Tr>
      <Tr>
        <Td>Ben</Td>
        <Td>Harper</Td>
        <Td align='right'>{Menu}</Td>
      </Tr>
    </>
  )
}

export const WithoutThead = Default.bind({})
WithoutThead.args = {
  tbody: (
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
}

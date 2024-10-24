import { Icon } from '#ui/atoms/Icon'
import { Table, Td, Th, Tr, type TableProps } from '#ui/atoms/Table'
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

const Menu = (
  <Dropdown
    dropdownLabel={<Icon name='dotsThree' size={24} />}
    dropdownItems={[
      <DropdownItem key='delete' label='Delete' onClick={() => {}} />
    ]}
  />
)

const baseProps: Partial<TableProps> = {
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

export const Default = Template.bind({})
Default.args = {
  ...baseProps
}

export const VariantBoxed = Template.bind({})
VariantBoxed.parameters = {
  ...(VariantBoxed.parameters ?? {}),
  backgrounds: { default: 'overlay' }
}
VariantBoxed.args = {
  ...baseProps,
  variant: 'boxed'
}

export const WithoutThead = Default.bind({})
WithoutThead.args = {
  tbody: baseProps.tbody
}

/** By default all columns are left aligned, but we support native HTML `align` attribute */
export const CustomColumnsAlignments: StoryFn = () => {
  return (
    <Table
      thead={
        <Tr>
          <Th>Left</Th>
          <Th align='center'>Center</Th>
          <Th align='right'>Right</Th>
        </Tr>
      }
      tbody={
        <>
          <Tr>
            <Td>Left</Td>
            <Td align='center'>Center</Td>
            <Td align='right'>right</Td>
          </Tr>
          <Tr>
            <Td>Left</Td>
            <Td align='center'>Center</Td>
            <Td align='left'>left</Td>
          </Tr>
          <Tr>
            <Td align='center'>Center</Td>
            <Td align='left'>Left</Td>
            <Td align='right'>right</Td>
          </Tr>
        </>
      }
    />
  )
}

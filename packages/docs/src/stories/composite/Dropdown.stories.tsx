import { Section } from '#ui/atoms/Section'
import { Spacer } from '#ui/atoms/Spacer'
import { Dropdown, DropdownDivider, DropdownItem } from '#ui/composite/Dropdown'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Dropdown> = {
  title: 'Composite/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '120px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof Dropdown> = (args) => {
  return <Dropdown {...args} />
}

export const Default = Template.bind({})
Default.args = {
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** By default, the component renders as a `dots-three-circle` Phosphor icon, but you can provide instead a different icon or a more generic JSX Element. */
export const DropdownLabelAsJSXElement = Template.bind({})
DropdownLabelAsJSXElement.args = {
  dropdownLabel: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      fill='#000000'
      viewBox='0 0 256 256'
    >
      <path d='M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z' />
    </svg>
  ),
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** When the `dropdownLabel` prop is set as a `string`, the component renders as a link with a caret-down icon. */
export const DropdownLabelAsString = Template.bind({})
DropdownLabelAsString.args = {
  dropdownLabel: 'Add item',
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Add a SKU clicked!')
        }}
        label='Add a SKU'
      />
      <DropdownItem
        onClick={() => {
          alert('Add a bundle clicked!')
        }}
        label='Add a bundle'
      />
    </>
  )
}

/** Dropdown can also be used as a Section's action button. */
export const WithinASection: StoryFn<typeof Dropdown> = (args) => {
  return (
    <Section title='Summary' actionButton={<Dropdown {...args} />}>
      <Spacer top='4'>Content here ..</Spacer>
    </Section>
  )
}
WithinASection.args = DropdownLabelAsString.args
WithinASection.parameters = {
  layout: 'padded'
}

import { Section } from '#ui/atoms/Section'
import { Spacer } from '#ui/atoms/Spacer'
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownSearch
} from '#ui/composite/Dropdown'
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

/** Dropdown menu can have an header  */
export const MenuWithHeader = Template.bind({})
MenuWithHeader.args = {
  menuHeader: 'ringostarr@commercelayer-very-long-text.io',
  dropdownItems: (
    <>
      <DropdownItem onClick={() => {}} label='Edit' />
      <DropdownItem onClick={() => {}} label='Delete' />
    </>
  )
}

/**
 * Dropdown items can also have icons. When you need to list them
 * together with items without icons, you can pass `keep-space` so gap will be maintained.
 **/
export const ItemsWithIcons = Template.bind({})
ItemsWithIcons.args = {
  dropdownItems: (
    <>
      <DropdownItem onClick={() => {}} icon='userCircle' label='Profile' />
      <DropdownItem onClick={() => {}} icon='creditCard' label='Subscription' />
      <DropdownItem
        onClick={() => {}}
        icon='keep-space'
        label='Super long label that eventually will be trimmed'
      />
      <DropdownItem onClick={() => {}} icon='keep-space' label='No icon' />
      <DropdownDivider />
      <DropdownItem onClick={() => {}} icon='signOut' label='Logout' />
    </>
  )
}

/**
 * Dropdown can also accept a DropdownSearch item that returns debounced values.
 **/
export const WithDropdownSearch = Template.bind({})
WithDropdownSearch.args = {
  dropdownItems: (
    <>
      <DropdownSearch
        onSearch={(hint) => {
          console.log(hint)
        }}
        placeholder='Search...'
      />
      <DropdownDivider />
      <DropdownItem onClick={() => {}} icon='check' label='Green' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='Red' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='Yellow' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='Black' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='White' />
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

/** Dropdown can also be used with different opening positions */
export const Positioning: StoryFn<typeof Dropdown> = (args) => {
  const items = Default.args?.dropdownItems
  return (
    <div>
      <div className='flex flex-wrap gap-8 justify-around'>
        <Dropdown
          dropdownLabel={<div>top-left</div>}
          dropdownItems={items}
          menuPosition='top-left'
        />
        <Dropdown
          dropdownLabel={<div>top-right</div>}
          dropdownItems={items}
          menuPosition='top-right'
        />
        <Dropdown
          dropdownLabel={<div>bottom-left</div>}
          dropdownItems={items}
          menuPosition='bottom-left'
        />
        <Dropdown
          dropdownLabel={<div>bottom-right</div>}
          dropdownItems={items}
          menuPosition='bottom-right'
        />
      </div>
    </div>
  )
}
Positioning.decorators = [
  (Story) => (
    <div
      style={{
        paddingTop: '120px'
      }}
    >
      <Story />
    </div>
  )
]

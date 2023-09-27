import { DropdownMenuDivider, DropdownMenuItem } from '#ui/atoms/dropdown'
import { ContextMenu } from '#ui/composite/ContextMenu'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ContextMenu> = {
  title: 'Composite/ContextMenu',
  component: ContextMenu,
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

const Template: StoryFn<typeof ContextMenu> = (args) => {
  return <ContextMenu {...args} />
}

export const Default = Template.bind({})
Default.args = {
  menuItems: (
    <>
      <DropdownMenuItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownMenuDivider />
      <DropdownMenuItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** By default, the component renders as a `dots-three-circle` Phosphor icon, but you can provide instead a different icon or a more generic JSX Element. */
export const MenuLabelAsJSXElement = Template.bind({})
MenuLabelAsJSXElement.args = {
  menuLabel: (
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
  menuItems: (
    <>
      <DropdownMenuItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownMenuDivider />
      <DropdownMenuItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** When the `menuLabel` prop is set as a `string`, the component renders as a link with a caret down icon. */
export const MenuLabelAsString = Template.bind({})
MenuLabelAsString.args = {
  menuLabel: 'Add item',
  menuItems: (
    <>
      <DropdownMenuItem
        onClick={() => {
          alert('Add a SKU clicked!')
        }}
        label='Add a SKU'
      />
      <DropdownMenuItem
        onClick={() => {
          alert('Add a bundle clicked!')
        }}
        label='Add a bundle'
      />
    </>
  )
}

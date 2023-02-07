import {
  DropdownMenuDivider,
  DropdownMenuItem
} from '#core-app-elements/atoms/dropdown'
import ContextMenu from '#core-app-elements/composite/ContextMenu'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof ContextMenu> = {
  title: 'Composite/ContextMenu',
  component: ContextMenu
}
export default setup

const Template: ComponentStory<typeof ContextMenu> = (args) => {
  return <ContextMenu {...args} />
}

export const Default = Template.bind({})
Default.args = {
  menuItems: (
    <>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuDivider />
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </>
  )
}

export const WithMenuLabel = Template.bind({})
WithMenuLabel.args = {
  menuLabel: 'search engines',
  menuItems: (
    <>
      <DropdownMenuItem
        onClick={() => {
          alert('Alert')
        }}
      >
        Alert
      </DropdownMenuItem>
      <DropdownMenuDivider />
      <DropdownMenuItem
        onClick={() => {
          window.open('https://www.google.com')
        }}
      >
        Google
      </DropdownMenuItem>
      <DropdownMenuDivider />
      <DropdownMenuItem
        onClick={() => {
          window.open('https://www.bing.com')
        }}
      >
        Bing
      </DropdownMenuItem>
    </>
  )
}

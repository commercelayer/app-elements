import {
  DropdownMenu,
  DropdownMenuDivider,
  DropdownMenuItem
} from '#core-app-elements/atoms/dropdown'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof DropdownMenu> = {
  title: 'Atoms/DropdownMenu',
  component: DropdownMenu
}
export default setup

const Template: ComponentStory<typeof DropdownMenu> = (args) => (
  <DropdownMenu {...args}>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuDivider />
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenu>
)

export const Default = Template.bind({})
Default.args = {}

import {
  DropdownMenu,
  DropdownMenuDivider,
  DropdownMenuItem
} from '#ui/atoms/dropdown'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof DropdownMenu> = {
  title: 'Atoms/DropdownMenu',
  component: DropdownMenu
}
export default setup

const Template: ComponentStory<typeof DropdownMenu> = (args) => (
  <DropdownMenu {...args}>
    <DropdownMenuItem label='Edit' />
    <DropdownMenuDivider />
    <DropdownMenuItem label='Delete' />
  </DropdownMenu>
)

export const Default = Template.bind({})
Default.args = {}

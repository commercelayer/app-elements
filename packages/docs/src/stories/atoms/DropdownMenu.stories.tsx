import {
  DropdownMenu,
  DropdownMenuDivider,
  DropdownMenuItem
} from '#ui/atoms/dropdown'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof DropdownMenu> = {
  title: 'Atoms/DropdownMenu',
  component: DropdownMenu
}
export default setup

const Template: StoryFn<typeof DropdownMenu> = (args) => (
  <DropdownMenu {...args}>
    <DropdownMenuItem label='Edit' />
    <DropdownMenuDivider />
    <DropdownMenuItem label='Delete' />
  </DropdownMenu>
)

export const Default = Template.bind({})
Default.args = {}

import { DropdownMenuDivider, DropdownMenuItem } from '#ui/atoms/dropdown'
import { ContextMenu } from '#ui/composite/ContextMenu'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ContextMenu> = {
  title: 'Composite/ContextMenu',
  component: ContextMenu
}
export default setup

const Template: StoryFn<typeof ContextMenu> = (args) => {
  return <ContextMenu {...args} />
}

export const Default = Template.bind({})
Default.args = {
  menuItems: (
    <>
      <DropdownMenuItem label='Edit' />
      <DropdownMenuDivider />
      <DropdownMenuItem label='Delete' />
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
        label='Alert'
      />
      <DropdownMenuDivider />
      <DropdownMenuItem
        onClick={() => {
          window.open('https://www.google.com')
        }}
        label='Google'
      />

      <DropdownMenuDivider />
      <DropdownMenuItem
        onClick={() => {
          window.open('https://www.bing.com')
        }}
        label='Bing'
      />
    </>
  )
}

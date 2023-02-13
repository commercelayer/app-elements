import {
  DropdownMenuDivider,
  DropdownMenuItem
} from '#core-app-elements/atoms/dropdown'
import { ContextMenu } from '#core-app-elements/composite/ContextMenu'
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

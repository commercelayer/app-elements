import {
  OrganizationMenu,
  OrganizationMenuItem
} from '#ui/composite/OrganizationMenu'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof OrganizationMenu> = {
  title: 'Composite/OrganizationMenu',
  component: OrganizationMenu,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof OrganizationMenu> = (args) => (
  <OrganizationMenu>
    <OrganizationMenuItem isActive type='home' />
    <OrganizationMenuItem type='apps' />
    <OrganizationMenuItem type='resources' />
    <OrganizationMenuItem type='credentials' />
    <OrganizationMenuItem type='team' />
    <OrganizationMenuItem type='settings' />
  </OrganizationMenu>
)

export const Default = Template.bind({})
Default.args = {}

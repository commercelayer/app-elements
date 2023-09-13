import { ResourceListItemsMetadata } from '#ui/resources/ResourceListItemsMetadata'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceListItemsMetadata> = {
  title: 'Resources/ResourceListItemsMetadata (DEPRECATED)',
  component: ResourceListItemsMetadata,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ResourceListItemsMetadata> = (args) => (
  <ResourceListItemsMetadata {...args} />
)

export const Default = Template.bind({})
Default.args = {
  metadata: {
    first_name: 'Michael',
    last_name: 'Jordan',
    country: 'U.S.A.',
    age: 60,
    specs: { teams: ['Chicago Bulls', 'Washington Wizards'] }
  }
}

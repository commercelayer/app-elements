import { ListItemsMetadata } from '#ui/resources/ListItemsMetadata'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListItemsMetadata> = {
  title: 'Resources/ListItemsMetadata (DEPRECATED)',
  component: ListItemsMetadata,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ListItemsMetadata> = (args) => (
  <ListItemsMetadata {...args} />
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

import { ListItemsMetadata } from '#ui/resources/ListItemsMetadata'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListItemsMetadata> = {
  title: 'Resources/ListItems Metadata',
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
    name: 'Michael',
    surname: 'Jordan',
    country: 'U.S.A.',
    age: 60,
    specs: { teams: ['Chicago Bulls', 'Washington Wizards'] }
  }
}

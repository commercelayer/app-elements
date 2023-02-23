import { ListItem } from '#ui/lists/ListItem'
import { List } from '#ui/lists/List'
import { Text } from '#ui/atoms/Text'
import { Container } from '#ui/atoms/Container'
import { ComponentStory, Meta } from '@storybook/react'
import { Icon } from '#ui/atoms/Icon'

const setup: Meta = {
  title: 'Examples/Resources',
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof List> = (args) => (
  <Container>
    <List {...args} actionButton={undefined} pagination={undefined}>
      {['Customers', 'Orders', 'Prices', 'SKUs', 'SKU lists'].map(
        (resource) => (
          <ListItem key={resource} onClick={() => {}}>
            <Text weight='semibold'>{resource}</Text>
            <Icon name='caretRight' />
          </ListItem>
        )
      )}
    </List>
  </Container>
)

export const Default = Template.bind({})

import { A } from '#ui/atoms/A'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { Text } from '#ui/atoms/Text'
import { Dropdown, DropdownItem } from '#ui/composite/Dropdown'
import { ListDetailsItem } from '#ui/composite/ListDetailsItem'
import { ListItem } from '#ui/composite/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListDetailsItem> = {
  title: 'Composite/ListDetailsItem',
  component: ListDetailsItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ListDetailsItem> = (args) => (
  <ListDetailsItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Name',
  isLoading: false,
  children: 'Gray Women Crop Top with Black Logo (M)'
}

export const WithLink = Template.bind({})
WithLink.args = {
  label: 'Name',
  isLoading: false,
  children: (
    <A target='_blank' href='https://commercelayer.io'>
      Gray Women Crop Top with Black Logo (M)
    </A>
  )
}

export const Empty = Template.bind({})
Empty.args = {
  label: 'Name',
  isLoading: false,
  childrenAlign: 'right'
}

export const List: StoryFn<typeof ListDetailsItem> = (_args) => (
  <>
    <ListDetailsItem
      label='Status'
      childrenAlign='right'
      border='none'
      gutter='none'
    >
      <Button variant='link'>In transit</Button>
    </ListDetailsItem>
    <ListDetailsItem
      label='Tracking'
      childrenAlign='right'
      border='none'
      gutter='none'
    >
      42314321ASD4545
    </ListDetailsItem>
    <ListDetailsItem
      label='Estimated delivery'
      childrenAlign='right'
      border='none'
      gutter='none'
    >
      May 17, 2023 12:00 AM
    </ListDetailsItem>
  </>
)

export const ListWithActions: StoryFn<typeof ListDetailsItem> = (_args) => {
  const Menu = (
    <Dropdown
      dropdownLabel={<Icon name='dotsThree' size={24} />}
      dropdownItems={[
        <DropdownItem key='delete' label='Delete' onClick={() => {}} />
      ]}
    />
  )
  return (
    <Section title='List' actionButton={<Button variant='link'>Add</Button>}>
      <ListDetailsItem label='Number' gutter='none'>
        <ListItem tag='div' padding='none' borderStyle='none'>
          <Text weight='semibold'>is greater than 10</Text>
          {Menu}
        </ListItem>
      </ListDetailsItem>
      <ListDetailsItem label='Color' gutter='none'>
        <ListItem tag='div' padding='none' borderStyle='none'>
          <Text weight='semibold'>is not Red</Text>
          {Menu}
        </ListItem>
      </ListDetailsItem>
      <ListDetailsItem label='Item' gutter='none'>
        <ListItem tag='div' padding='none' borderStyle='none'>
          <Text weight='semibold'>is the last one</Text>
          {Menu}
        </ListItem>
      </ListDetailsItem>
      <br />
    </Section>
  )
}

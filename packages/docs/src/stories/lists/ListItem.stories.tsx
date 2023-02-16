import { ListItem } from '#ui/lists/ListItem'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof ListItem> = {
  title: 'Lists/ListItem',
  component: ListItem,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'SKUs',
  onClick: () => undefined
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  label: 'WGDMSMNOwJ',
  description: 'June 15, 2022 14:57',
  onClick: () => undefined
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  label: 'CLI',
  description: 'Integration',
  icon: <MyIcon />
}

function MyIcon(): JSX.Element {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#e6e7e7',
        borderRadius: '100%'
      }}
    />
  )
}

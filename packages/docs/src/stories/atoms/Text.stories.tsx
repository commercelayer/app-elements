import { Text } from '#ui/atoms/Text'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Text> = (args) => <Text {...args} />

export const Default = Template.bind({})
Default.args = {
  variant: 'info',
  size: 'inherit',
  weight: 'regular',
  align: 'left',
  wrap: 'inherit',
  tag: 'span',
  children:
    'Commerce Layer is a multi-market commerce API and order management system'
}

export const Success = Template.bind({})
Success.args = {
  variant: 'success',
  size: 'regular',
  weight: 'bold',
  children:
    'Commerce Layer is a multi-market commerce API and order management system'
}

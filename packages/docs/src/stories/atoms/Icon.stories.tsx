import Icon from '#core-app-elements/atoms/Icon'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon
}
export default setup

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'check',
  background: 'none',
  gap: 'regular'
}

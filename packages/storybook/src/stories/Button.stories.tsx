import Button from '#core-app-elements/atoms/Button'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button
}
export default setup

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})

Primary.args = {
  variant: 'primary',
  // size: 'large',
  children: 'Hello'
}

import { Button } from '#ui/atoms/Button'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button
}
export default setup

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  variant: 'primary',
  children: 'Hello'
}

export const Danger = Template.bind({})
Danger.args = {
  variant: 'danger',
  children: 'Delete webhook'
}

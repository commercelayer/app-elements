import { A } from '#ui/atoms/A'
import { Button } from '#ui/atoms/Button'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Button> = (args) => (
  <div>
    <Button {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  variant: 'primary',
  children: 'Hello',
  disabled: false
}

export const Danger = Template.bind({})
Danger.args = {
  variant: 'danger',
  children: 'Delete webhook'
}

export const Link: StoryFn = (args) => (
  <div>
    <Button variant='link'>I am a button</Button>
    <br />
    <A onClick={() => {}}>I am a link</A>
  </div>
)

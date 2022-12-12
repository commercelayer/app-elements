import Button from '#core-app-elements/Button'
import { ComponentStory, ComponentMeta } from '@storybook/react'

// 👇 This default export determines where your story goes in the story list
const setup: ComponentMeta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button
}
export default setup

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})

Primary.args = {
  variant: 'primary',
  // size: 'large',
  children: 'Hello'
}

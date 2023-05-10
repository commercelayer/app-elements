import { A } from '#ui/atoms/A'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof A> = {
  title: 'Atoms/A',
  component: A
}
export default setup

const Template: StoryFn<typeof A> = (args) => <A {...args}>I am a link</A>

export const Default = Template.bind({})
Default.args = {
  href: 'https://commercelayer.io/',
  target: '_blank',
  onClick: () => {}
}

import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof AvatarLetter> = {
  title: 'Atoms/AvatarLetter',
  component: AvatarLetter
}
export default setup

const Template: StoryFn<typeof AvatarLetter> = (args) => (
  <AvatarLetter {...args} />
)

export const Initials = Template.bind({})
Initials.args = {
  text: 'Commerce Layer'
}

export const SingleWorld = Template.bind({})
SingleWorld.args = {
  text: 'Europe'
}

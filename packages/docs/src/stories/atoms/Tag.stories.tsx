import { Tag } from '#ui/atoms/Tag'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Tag> = {
  title: 'Atoms/Tag',
  component: Tag
}
export default setup

const Template: StoryFn<typeof Tag> = (args) => <Tag {...args}>logo-pink</Tag>

export const Default = Template.bind({})

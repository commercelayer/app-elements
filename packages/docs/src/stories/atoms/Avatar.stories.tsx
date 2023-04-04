import { Avatar } from '#ui/atoms/Avatar'
import { type ComponentStory, type ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar
}
export default setup

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />

export const ProfilePicture = Template.bind({})
ProfilePicture.args = {
  src: 'https://ui-avatars.com/api/Commerce+Layer/160/101111/FFFFFF/2/0.33/false/true/true',
  alt: 'Commerce Layer',
  border: 'none',
  shape: 'circle'
}

export const Product = Template.bind({})
Product.args = {
  src: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
  alt: 'Hat'
}

export const Portrait = Template.bind({})
Portrait.args = {
  src: 'https://via.placeholder.com/58x200',
  alt: 'Portrait'
}

export const Landscape = Template.bind({})
Landscape.args = {
  src: 'https://via.placeholder.com/200x58',
  alt: 'Portrait'
}

export const Small = Template.bind({})
Small.args = {
  src: 'https://via.placeholder.com/30x30',
  alt: 'Small'
}

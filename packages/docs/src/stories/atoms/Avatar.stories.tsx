import { Avatar } from '#ui/atoms/Avatar'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar
}
export default setup

const Template: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />

export const ProfilePicture = Template.bind({})
ProfilePicture.args = {
  src: 'https://ui-avatars.com/api/Commerce+Layer/160/101111/FFFFFF/2/0.33/false/true/true',
  alt: 'Commerce Layer',
  border: 'none',
  shape: 'circle'
}

export const Payments = (): JSX.Element => (
  <div className='flex gap-1 flex-wrap'>
    <Avatar shape='circle' src='payments:adyen' alt='Adyen' />
    <Avatar shape='circle' src='payments:axerve' alt='Axerve' />
    <Avatar shape='circle' src='payments:braintree' alt='Braintree' />
    <Avatar shape='circle' src='payments:checkout' alt='Checkout' />
    <Avatar shape='circle' src='payments:klarna' alt='Klarna' />
    <Avatar shape='circle' src='payments:paypal' alt='Paypal' />
    <Avatar shape='circle' src='payments:satispay' alt='Satispay' />
    <Avatar shape='circle' src='payments:stripe' alt='Stripe' />
  </div>
)

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

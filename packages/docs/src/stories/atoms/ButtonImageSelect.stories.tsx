import { ButtonImageSelect } from '#ui/atoms/ButtonImageSelect'
import type { Meta, StoryFn } from '@storybook/react'

const setup: Meta<typeof ButtonImageSelect> = {
  title: 'Atoms/ButtonImageSelect',
  parameters: {
    layout: 'padded'
  },
  component: ButtonImageSelect
}

export default setup

const Template: StoryFn<typeof ButtonImageSelect> = (args) => (
  <div>
    <ButtonImageSelect {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {}

export const WithImage = Template.bind({})
WithImage.args = {
  src: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
  alt: ''
}

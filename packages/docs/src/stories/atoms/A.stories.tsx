import { A } from '#ui/atoms/A'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof A> = {
  title: 'Atoms/A',
  component: A
}
export default setup

const Template: ComponentStory<typeof A> = (args) => (
  <A {...args}>I am a link</A>
)

export const Default = Template.bind({})
Default.args = {
  href: 'https://commercelayer.io/',
  target: '_blank',
  onClick: () => {}
}

import { A } from '#ui/atoms/A'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof A> = {
  title: 'Atoms/A',
  component: A,
  argTypes: {
    href: {
      type: {
        required: true,
        name: 'string'
      },
      description:
        'The URL that the hyperlink points to. Links are not restricted to HTTP-based URLs — they can use any URL scheme supported by browsers.'
    },
    target: {
      type: 'string',
      description:
        'Where to display the linked URL, as the name for a browsing context (a tab, window, or `<iframe>`).'
    }
  }
}
export default setup

const Template: StoryFn<typeof A> = (args) => (
  <>
    <A {...args}>I am the &lt;A&gt; element</A>
    <a {...args}>I am an &lt;a&gt; HTML element</a>
  </>
)

export const Default = Template.bind({})
Default.args = {
  href: 'https://commercelayer.io',
  target: '_blank'
}

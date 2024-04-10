import { A } from '#ui/atoms/A'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Spacer } from '#ui/atoms/Spacer'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof A> = {
  title: 'Atoms/A',
  component: A,
  parameters: {
    layout: 'padded'
  },
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
  <div>
    <A {...args}>Hello</A>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  href: 'https://commercelayer.io',
  target: '_blank',
  disabled: false
}

/**
 * The `a` HTML element is styled only when the `class` attribute is not defined.
 * This is useful when using the wouter `Link` component.
 *
 * ```tsx
 * <Link href="https://commercelayer.io">Text</Link>
 * ```
 */
export const HTMLElement: StoryFn = () => (
  <>
    <A href='https://commercelayer.io' target='_blank'>
      I am the &lt;A&gt; component
    </A>
    <a href='https://commercelayer.io' target='_blank' rel='noreferrer'>
      I am an &lt;a&gt; HTML element
    </a>
    <a
      href='https://commercelayer.io'
      target='_blank'
      rel='noreferrer'
      className='boh'
    >
      I am an &lt;a&gt; HTML element and I'm not styled due to my class
      attribute
    </a>
  </>
)

export const WithText: StoryFn = () => (
  <div>
    A{' '}
    <A href='https://commercelayer.io' target='_blank'>
      link
    </A>{' '}
    in between other text.
  </div>
)

export const VariantLink: StoryFn = () => (
  <div>
    <Spacer>
      <A href='https://commercelayer.io' target='_blank'>
        I am an &lt;a&gt; element
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button variant='link'>I am a &lt;button&gt; element</Button>
    </Spacer>
  </div>
)

export const VariantPrimary: StoryFn = () => (
  <div>
    <Spacer>
      <A href='https://commercelayer.io' target='_blank' variant='primary'>
        I am an &lt;a&gt; element
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button>I am a &lt;button&gt; element</Button>
    </Spacer>
  </div>
)

export const VariantSecondary: StoryFn = () => (
  <div>
    <Spacer>
      <A href='https://commercelayer.io' target='_blank' variant='secondary'>
        I am an &lt;a&gt; element
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button variant='secondary'>I am a &lt;button&gt; element</Button>
    </Spacer>
  </div>
)

export const VariantDanger: StoryFn = () => (
  <div>
    <Spacer>
      <A href='https://commercelayer.io' target='_blank' variant='danger'>
        I am an &lt;a&gt; element
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button variant='danger'>I am a &lt;button&gt; element</Button>
    </Spacer>
  </div>
)

export const VariantSecondaryMini: StoryFn = () => (
  <div>
    <Spacer>
      <A
        href='https://commercelayer.io'
        target='_blank'
        variant='secondary'
        size='mini'
        alignItems='center'
      >
        <Icon name='plus' size={16} /> Rule
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button variant='secondary' size='mini' alignItems='center'>
        <Icon name='plus' size={16} /> Rule
      </Button>
    </Spacer>
  </div>
)

export const WithIconOnly: StoryFn = () => (
  <div>
    <Spacer>
      <A href='https://commercelayer.io' target='_blank' variant='secondary'>
        <Icon name='dotsThree' size={16} />
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button variant='secondary'>
        <Icon name='dotsThree' size={16} />
      </Button>
    </Spacer>
  </div>
)

export const Circle: StoryFn = () => (
  <div>
    <Spacer>
      <A href='https://commercelayer.io' target='_blank' variant='circle'>
        <Icon name='dotsThree' size={24} />
      </A>
    </Spacer>
    <Spacer top='4'>
      <Button variant='circle'>
        <Icon name='dotsThree' size={24} />
      </Button>
    </Spacer>
  </div>
)

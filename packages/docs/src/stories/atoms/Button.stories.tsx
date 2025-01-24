import { A } from '#ui/atoms/A'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Input as InputElement } from '#ui/forms/Input'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Button> = (args) => (
  <div>
    <Button {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  variant: 'primary',
  children: 'Hello',
  disabled: false
}

/** When you need to delete a resource or want to perform an irreversible action you can use a `danger` button that visually warns the user. */
export const Danger = Template.bind({})
Danger.args = {
  variant: 'danger',
  children: 'Delete webhook'
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
  children: 'Add webhook'
}

export const SecondaryMini = Template.bind({})
SecondaryMini.args = {
  size: 'mini',
  variant: 'secondary',
  alignItems: 'center',
  children: (
    <>
      <Icon name='plus' size={16} /> Rule
    </>
  )
}

/** A `<Button>` can also be rendered as a `link` anytime you need a inline action that doesn't point to a url. */
export const Link: StoryFn = (_args) => (
  <div>
    <Button variant='link'>I am a button</Button>
    <br />
    <A href='https://commercelayer.io'>I am a link</A>
    <br />
    <br />
    <Button
      variant='link'
      onClick={() => {
        alert('Item added!')
      }}
    >
      Add item
    </Button>
  </div>
)

export const WithText: StoryFn = () => (
  <div>
    A <Button variant='link'>button</Button> in between other text.
  </div>
)

/** A `<Button>` that contains only an `Icon` is rendered with a square shape. */
export const IconOnly = Template.bind({})
IconOnly.args = {
  variant: 'secondary',
  children: <Icon name='dotsThree' size={16} />
}

/** A `<Button>` with `variant="circle"` that contains only an `Icon` is rendered with a circle shape. */
export const Circle = Template.bind({})
Circle.args = {
  variant: 'circle',
  children: <Icon name='dotsThree' size={24} />
}

/** A `<Button>` with `variant="input"` can be used to simulate an input/select that opens an overlay with a more complex design.  */
export const Input: StoryFn = (_args) => (
  <div>
    A button:
    <Button type='button' variant='input'>
      Search products...
    </Button>
    <br />
    <br />
    An input:
    <InputElement placeholder='Search products...' />
  </div>
)

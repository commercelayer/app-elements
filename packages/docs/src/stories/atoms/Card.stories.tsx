import { Button } from '#ui/atoms/Button'
import { Card } from '#ui/atoms/Card'
import { Spacer } from '#ui/atoms/Spacer'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { Input } from '#ui/forms/Input'
import { InputSelect } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card
}
export default setup

const Template: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <p>
      <strong>I am a card</strong>
    </p>
    <p>I am a card content row</p>
    <p>I am a card content row</p>
    <p>I am a card content row</p>
  </Card>
)

export const Default = Template.bind({})
Default.args = {
  overflow: 'visible'
}

/** Card can have a `footer` that renders in dedicated section. */
export const Footer: StoryFn<typeof Card> = (args) => (
  <Card {...args}>I'm the card content</Card>
)
Footer.args = {
  overflow: 'visible',
  footer: (
    <div className='text-center'>
      <Button variant='link'>
        <StatusIcon gap='small' className='text-2xl mr-1' name='cloudArrowUp' />{' '}
        <Text size='small'>Download file</Text>
      </Button>
    </div>
  )
}

/**
 * The rounded corner should also be visible when children have a background.
 * In this case you can set `overflow` prop to `hidden` to keep rounded corners on children background.
 */
export const ChildrenWithBackground: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      Item #1
    </ListItem>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      Item #2
    </ListItem>
    <ListItem tag='a' onClick={() => {}} borderStyle='none'>
      Item #3
    </ListItem>
  </Card>
)
ChildrenWithBackground.args = {
  gap: '1',
  overflow: 'hidden'
}

/** Card can have a background color */
export const WithBackgroundColor: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <p>
      <strong>I am a card</strong>
    </p>
    <p>I am a card content row</p>
    <p>I am a card content row</p>
    <p>I am a card content row</p>
  </Card>
)
WithBackgroundColor.args = {
  backgroundColor: 'light',
  overflow: 'hidden'
}

/**
 * When you are rending content like a select or dropdown you might want to have `overflow: visible`
 * to prevent inner content clipping.
 */
export const WithOverflowingContent: StoryFn<typeof Card> = (args) => (
  <Card backgroundColor='light' overflow='visible'>
    <Spacer bottom='4'>
      <Input label='Fullname' />
    </Spacer>
    <Spacer bottom='4'>
      <InputSelect
        label='Favorite color'
        initialValues={['red', 'blue'].map((v) => ({
          label: v,
          value: v
        }))}
        onSelect={() => {}}
      />
    </Spacer>
  </Card>
)
WithOverflowingContent.decorators = [
  (Story) => (
    <div style={{ paddingBottom: '2rem' }}>
      <Story />
    </div>
  )
]

import { ButtonCard } from '#ui/atoms/ButtonCard'
import { Text } from '#ui/atoms/Text'
import type { Meta, StoryFn } from '@storybook/react'

const setup: Meta<typeof ButtonCard> = {
  title: 'Atoms/ButtonCard',
  parameters: {
    layout: 'padded'
  },
  component: ButtonCard
}

export default setup

const Template: StoryFn<typeof ButtonCard> = (args) => (
  <div>
    <ButtonCard {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  fullWidth: true,
  icon: 'arrowDown',
  iconLabel: 'Download',
  onClick: () => {
    alert('main clicked')
  }
}

export const WithChildren = Template.bind({})
WithChildren.args = {
  fullWidth: true,
  icon: 'arrowCircleUp',
  padding: '6',
  children: (
    <Text align='left' variant='info'>
      <a>Set conditions</a> to limit the promotion to specific orders.
      <br />
      Promotion applies only if all conditions are met.
    </Text>
  ),
  onClick: () => {
    alert('main clicked')
  }
}

export const JustText = Template.bind({})
JustText.args = {
  fullWidth: true,
  iconLabel: 'Add items',
  onClick: () => {
    alert('main clicked')
  }
}

import { Button } from '#ui/atoms/Button'
import { PageHeading } from '#ui/atoms/PageHeading'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof PageHeading> = {
  title: 'Atoms/PageHeading',
  component: PageHeading,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof PageHeading> = (args) => (
  <PageHeading {...args} actionButton={<Button variant='link'>Edit</Button>} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Resources',
  description: 'Lorem ipsum dolor sit'
}

export const WithNavGoBack = Template.bind({})
WithNavGoBack.args = {
  title: 'Order details',
  description: 'Lorem ipsum dolor sit',
  navigationButton: {
    label: 'All orders',
    onClick: () => {
      historyGoBack()
    }
  }
}

export const WithNavClose = Template.bind({})
WithNavClose.args = {
  title: 'SKUs',
  description: 'Lorem ipsum dolor sit',
  navigationButton: {
    label: 'Close',
    onClick: () => {
      historyGoBack()
    },
    icon: 'x'
  }
}

export const WithBadge = Template.bind({})
WithBadge.args = {
  title: 'SKUs',
  badgeLabel: 'TEST DATA',
  navigationButton: {
    label: 'Back',
    onClick: () => {
      historyGoBack()
    }
  }
}

function historyGoBack(): undefined {
  return undefined
}

import { Steps } from '#ui/atoms/Steps'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Steps> = {
  title: 'Atoms/Steps',
  component: Steps,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Steps> = (args) => <Steps {...args} />

export const Default = Template.bind({})
Default.args = {
  steps: [
    {
      label: 'Pre-Transit'
    },
    {
      label: 'In Transit'
    },
    {
      label: 'Out for delivery'
    },
    {
      label: 'Delivered'
    }
  ]
}

export const WithFirstActive = Template.bind({})
WithFirstActive.args = {
  steps: [
    {
      label: 'Pre-Transit',
      active: true
    },
    {
      label: 'In Transit'
    },
    {
      label: 'Out for delivery'
    },
    {
      label: 'Delivered'
    }
  ]
}

export const WithActive = Template.bind({})
WithActive.args = {
  steps: [
    {
      label: 'Pre-Transit'
    },
    {
      label: 'In Transit'
    },
    {
      label: 'Out for delivery',
      active: true
    },
    {
      label: 'Delivered'
    }
  ]
}

export const WithLastActive = Template.bind({})
WithLastActive.args = {
  steps: [
    {
      label: 'Pre-Transit'
    },
    {
      label: 'In Transit'
    },
    {
      label: 'Out for delivery'
    },
    {
      label: 'Delivered',
      active: true
    }
  ]
}

export const With2Steps = Template.bind({})
With2Steps.args = {
  steps: [
    {
      label: 'Step 1',
      active: true
    },
    {
      label: 'Step 2',
      active: true
    }
  ]
}

export const With5Steps = Template.bind({})
With5Steps.args = {
  steps: [
    {
      label: 'Step 1'
    },
    {
      label: 'Step 2'
    },
    {
      label: 'Step 3'
    },
    {
      label: 'Step 4'
    },
    {
      label: 'Step 5',
      active: true
    }
  ]
}

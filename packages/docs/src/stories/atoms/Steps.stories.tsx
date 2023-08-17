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
      label: 'Out for delivery',
      active: true
    },
    {
      label: 'Delivered'
    }
  ]
}

export const NoActive = Template.bind({})
NoActive.args = {
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

export const FirstActive = Template.bind({})
FirstActive.args = {
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

export const LastActive = Template.bind({})
LastActive.args = {
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

export const With7Steps = Template.bind({})
With7Steps.args = {
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
    },
    {
      label: 'Step 6'
    },
    {
      label: 'Step 7'
    }
  ]
}

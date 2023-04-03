import { Text } from '#app-elements/atoms/Text'
import { Timeline } from '#ui/composite/Timeline'

import { ComponentMeta, ComponentStory } from '@storybook/react'
import { set, sub } from 'date-fns'

const setup: ComponentMeta<typeof Timeline> = {
  title: 'Composite/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Timeline> = (args) => (
  <Timeline {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onKeyDown: (e) => {
    if (e.code === 'Enter') {
      alert(e.currentTarget.value)
      e.currentTarget.value = ''
    }
  },
  events: [
    {
      date: sub(
        set(new Date(), {
          month: 11,
          date: 29,
          minutes: 23,
          seconds: 12
        }),
        { years: 1 }
      ).toJSON(),
      message: (
        <span>
          <Text weight='bold'>M. Jordan</Text> placed this order · 23:12
        </span>
      )
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        minutes: 6,
        seconds: 27
      }).toJSON(),
      message: '$250,5 authorized on stripe · 6:27'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        minutes: 6,
        seconds: 28
      }).toJSON(),
      message: 'Approved · 6:28 AM'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        minutes: 6,
        seconds: 29
      }).toJSON(),
      message: '$250,50 captured on stripe · 6:29'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        minutes: 6,
        seconds: 20
      }).toJSON(),
      message: 'Fulfillment in progress · 6:20'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        minutes: 8,
        seconds: 35
      }).toJSON(),
      message: (
        <span>
          <Text weight='bold'>S. Jennigs</Text> left a note · 8:35
        </span>
      ),
      note: 'Customer would like to receive parcel sooner, please request the customer phone number.'
    },
    {
      date: new Date().toJSON(),
      message: 'Fullfilled · 15:23'
    }
  ]
}

export const Empty = Template.bind({})
Empty.args = {
  events: []
}

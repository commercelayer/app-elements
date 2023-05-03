import { Text } from '#app-elements/atoms/Text'
import { Timeline } from '#ui/composite/Timeline'

import { type Meta, type StoryFn } from '@storybook/react'
import { set, sub } from 'date-fns'

const setup: Meta<typeof Timeline> = {
  title: 'Composite/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Timeline> = (args) => <Timeline {...args} />

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
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
          seconds: 10
        }),
        { years: 1 }
      ).toJSON(),
      message: (
        <span>
          Text in two lines.
          <br />I should not see the border on my left · 23:10
        </span>
      )
    },
    {
      date: sub(
        set(new Date(), {
          month: 11,
          date: 29,
          minutes: 23,
          seconds: 11
        }),
        { years: 1 }
      ).toJSON(),
      message: (
        <span>
          Text in two lines.
          <br />I should see the border on my left · 23:11
        </span>
      )
    },
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
      message: `Placed · 23:12`
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        minutes: 6,
        seconds: 27
      }).toJSON(),
      message: '$250,5 authorized on stripe · 06:27'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        minutes: 6,
        seconds: 28
      }).toJSON(),
      message: 'Approved · 06:28'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 1,
        minutes: 6,
        seconds: 29
      }).toJSON(),
      message: '$250,50 captured on stripe · 06:29'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        minutes: 6,
        seconds: 20
      }).toJSON(),
      message: 'Fulfillment in progress · 06:20'
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
          <Text weight='bold'>S. Jennigs</Text> left a note · 08:35
        </span>
      ),
      note: 'Customer would like to receive parcel sooner, please request the customer phone number.'
    },
    {
      date: set(new Date(), {
        month: 0,
        date: 3,
        minutes: 8,
        seconds: 36
      }).toJSON(),
      message: (
        <span>
          <Text weight='bold'>S. Jennigs</Text> left a note · 08:35
        </span>
      ),
      note: 'Short text.'
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

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true,
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
    }
  ]
}

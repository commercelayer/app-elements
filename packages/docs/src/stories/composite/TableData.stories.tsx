import { I18NProvider } from '#providers/I18NProvider'
import { TableData } from '#ui/composite/TableData'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof TableData> = {
  title: 'Composite/TableData',
  component: TableData,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof TableData> = (args) => {
  return (
    <I18NProvider localeCode='it'>
      <TableData {...args} />
    </I18NProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  data: [
    {
      id: 'pwQe',
      amount: 10000,
      compare_amount: 13000,
      price_list_id: 'wBZrvCQvvBwBZrvCQvvB0',
      sku_code: 'C012'
    },
    {
      id: 'fQrq',
      amount: 900,
      compare_amount: 900,
      price_list_id: 'wBZrvCQvvBwBZrvCQvvB0',
      sku_code: 'C013'
    }
  ]
}

/** This is an example using all the props. */
export const CompleteExample = Template.bind({})
CompleteExample.args = {
  limit: 1,
  showOthers: true,
  showTotal: true,
  title: 'Preview',
  data: [
    {
      id: 'pwQe',
      amount: 10000,
      compare_amount: 13000,
      price_list_id: 'wBZrvCQvvBwBZrvCQvvB0',
      sku_code: 'C012'
    },
    {
      id: 'fQrq',
      amount: 900,
      compare_amount: 900,
      price_list_id: 'wBZrvCQvvBwBZrvCQvvB0',
      sku_code: 'C013'
    }
  ]
}

export const EmptyExample = Template.bind({})
EmptyExample.args = {
  limit: 1,
  showOthers: true,
  showTotal: true,
  title: 'Preview',
  data: []
}

/**
 * All the keys from each object will be displayed even if the `data` prop contains object with different shapes.
 */
export const DifferentShapes = Template.bind({})
DifferentShapes.args = {
  data: [
    {
      code: 'C012'
    },
    {
      id: 'fQrq',
      code: 'C013'
    }
  ]
}

/**
 * When data fits entirely the table, the horizontal scroll will not be visible.
 */
export const NoHorizontalScroll = Template.bind({})
NoHorizontalScroll.args = {
  data: [
    {
      id: 'pwQe',
      code: 'C012'
    },
    {
      id: 'fQrq',
      code: 'C013'
    }
  ]
}

/**
 * `data` prop can accept any JSON-like object.
 */
export const JSON = Template.bind({})
JSON.args = {
  data: [
    {
      id: 'pwQe',
      n: 12,
      codes: ['C012'],
      obj: { firstName: 'John' },
      null: null,
      checked: true
    }
  ]
}

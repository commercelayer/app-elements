import {
  InputSelect,
  type InputSelectProps,
  type SelectValue
} from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const fullList = [
  { value: 'customers', label: 'Customers' },
  { value: 'customer_subscriptions', label: 'Customer subscriptions' },
  { value: 'skus', label: 'SKUs' },
  { value: 'sku_lists', label: 'SKU Lists' },
  { value: 'prices', label: 'Prices' },
  { value: 'coupons', label: 'Coupons' },
  { value: 'gift_cards', label: 'Gift cards' },
  { value: 'tax_categories', label: 'Tax categories' },
  { value: 'stock_items', label: 'Stock items' },
  { value: 'addresses', label: 'Addresses' },
  { value: 'shipping_categories', label: 'Shipping Categories' },
  { value: 'sku_options', label: 'Sku Options' }
].sort((a, b) => a.label.localeCompare(b.label))

const setup: Meta<typeof InputSelect> = {
  title: 'Forms/ui/InputSelect',
  component: InputSelect,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputSelect> = (args) => {
  return <InputSelect {...args} />
}

export const Simple = Template.bind({})
Simple.args = {
  label: 'Search resource',
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isSearchable: true,
  isClearable: false
}

export const Async = Template.bind({})
Async.args = {
  label: 'Search resource',
  placeholder: 'Type to search async...',
  isSearchable: true,
  isClearable: false,
  debounceMs: 200,
  hint: {
    icon: 'bulb',
    text: 'Try to search some of the following values: customer, sku, price, tax'
  },
  loadAsyncValues: async (hint) => {
    return await new Promise<SelectValue[]>((resolve) => {
      setTimeout(() => {
        resolve(fakeSearch(hint))
      }, 1000)
    })
  }
}

export const Multi = Template.bind({})
Multi.args = {
  label: 'Search resource',
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isMulti: true,
  isSearchable: true,
  isClearable: false
}

const fakeSearch = (hint: string): SelectValue[] =>
  fullList.filter((item) =>
    item.label.toLowerCase().includes(hint.toLowerCase())
  )

const TemplateError: StoryFn<typeof InputSelect> = (args) => {
  const [feedback, setFeedback] = useState<InputSelectProps['feedback']>()
  return (
    <InputSelect
      {...args}
      label='Select resource'
      initialValues={fullList}
      onSelect={() => {
        setFeedback({
          variant: 'danger',
          message: 'Required field'
        })
      }}
      hint={{
        text: `Select an option to show error feedback`
      }}
      feedback={feedback}
    />
  )
}
export const WithError = TemplateError.bind({})

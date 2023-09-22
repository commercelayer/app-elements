import { InputSelect, type SelectValue } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'

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

const fakeSearch = (hint: string): SelectValue[] =>
  fullList.filter((item) =>
    item.label.toLowerCase().includes(hint.toLowerCase())
  )

const setup: Meta<typeof InputSelect> = {
  title: 'Forms/ui/InputSelect',
  component: InputSelect,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '300px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof InputSelect> = (args) => {
  return <InputSelect {...args} />
}

/**
 * <span type='info'>Default mode with ability to search within the provided `initialValues`</span>
 */
export const Simple = Template.bind({})
Simple.args = {
  label: 'Search resource',
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isSearchable: true,
  isClearable: false,
  onBlur: () => {}
}

/**
 * <span type='info'>With the `loadAsyncValues` prop, it's possible to return options asynchronously while typing. </span>
 */
export const Async = Template.bind({})
Async.args = {
  label: 'Search resource',
  placeholder: 'Type to search async...',
  isSearchable: true,
  isClearable: false,
  debounceMs: 200,
  hint: {
    icon: 'bulb',
    text: 'Try to search some of the following values: customer, SKU, price, tax'
  },
  loadAsyncValues: async (hint) => {
    return await new Promise<SelectValue[]>((resolve) => {
      setTimeout(() => {
        resolve(fakeSearch(hint))
      }, 1000)
    })
  }
}

/**
 * <span type='info'>`isMulti` allows to select more than one value</span>
 */
export const Multi = Template.bind({})
Multi.args = {
  label: 'Search resource',
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isMulti: true,
  isSearchable: true,
  isClearable: false
}

/**
 * <span type='info'>Options can be grouped by passing an array of objects with `label` and `options` properties.</span>
 */
export const GroupedOptions = Template.bind({})
GroupedOptions.args = {
  label: 'Select a Country',
  initialValues: [
    {
      label: 'Europe',
      options: [
        { label: 'France', value: 'fr' },
        { label: 'Italy', value: 'it' },
        { label: 'Spain', value: 'es' },
        { label: 'Germany', value: 'de' }
      ]
    },
    {
      label: 'America',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'Mexico', value: 'mx' }
      ]
    }
  ],
  placeholder: 'Type to filter list...',
  isMulti: false,
  isSearchable: true,
  isClearable: true
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Search resource',
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isSearchable: true,
  isClearable: false,
  feedback: {
    variant: 'danger',
    message: 'Required field'
  }
}

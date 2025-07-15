import { currencyInputSelectOptions } from '#helpers/currencies'
import { InputSelect, type InputSelectValue } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const fullList: InputSelectValue[] = [
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

const fakeSearch = (hint: string): InputSelectValue[] =>
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

export const Default = Template.bind({})
Default.args = {
  label: 'Search resource',
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isSearchable: true,
  isClearable: false,
  onBlur: () => {}
}

/**
 * Default mode with ability to search within the provided `initialValues`
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
 * Use `isDisabled` option property to disable the option. In the list below `Customers` will be disabled.
 */
export const DisabledOptions = Template.bind({})
DisabledOptions.args = {
  label: 'Search resource',
  initialValues: [
    { value: 'customer_subscriptions', label: 'Customer subscriptions' },
    { value: 'customers', label: 'Customers', isDisabled: true },
    { value: 'skus', label: 'SKUs' }
  ],
  placeholder: 'Type to filter list...',
  isSearchable: true,
  isClearable: false,
  onBlur: () => {}
}

/**
 * With the `loadAsyncValues` prop, it's possible to return options asynchronously while typing.
 */
export const Async = Template.bind({})
Async.args = {
  label: 'Search resource',
  placeholder: 'Type to search async...',
  isSearchable: true,
  isClearable: false,
  debounceMs: 200,
  hint: {
    icon: 'lightbulbFilament',
    text: 'Try to search some of the following values: customer, SKU, price, tax'
  },
  loadAsyncValues: async (hint) => {
    return await new Promise<InputSelectValue[]>((resolve) => {
      setTimeout(() => {
        resolve(fakeSearch(hint))
      }, 1000)
    })
  }
}

/**
 * It's possible to specify a footer text that will be rendered at the bottom of the dropdown list.
 */
export const MenuFooterText = Template.bind({})
MenuFooterText.args = {
  label: 'Search resource',
  placeholder: 'Type to search async...',
  isSearchable: true,
  isClearable: false,
  debounceMs: 200,
  hint: {
    icon: 'lightbulbFilament',
    text: 'Try to search some of the following values: customer, SKU, price, tax'
  },
  initialValues: fullList.slice(0, 5),
  loadAsyncValues: async (hint) => {
    return await new Promise<InputSelectValue[]>((resolve) => {
      setTimeout(() => {
        resolve(fakeSearch(hint))
      }, 1000)
    })
  },
  menuFooterText: 'Type to search for more options.'
}

/**
 * `isMulti` allows to select more than one value
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
 * `isCreatable` allows to add custom value to the list simply by typing it.
 */
export const Creatable = Template.bind({})
Creatable.args = {
  label: 'Search resource or type for new value',
  initialValues: fullList,
  placeholder: 'Type something...',
  isMulti: true,
  isSearchable: true,
  isClearable: false,
  isCreatable: true
}

/**
 * It's possible to combine the `loadAsyncValues` prop with the `isCreatable` prop.
 */
export const AsyncCreatable = Template.bind({})
AsyncCreatable.args = {
  label: 'Search resource',
  placeholder: 'Type to search async...',
  isSearchable: true,
  isCreatable: true,
  isClearable: false,
  debounceMs: 200,
  hint: {
    icon: 'lightbulbFilament',
    text: 'Try to search some of the following values: customer, SKU, price, tax or any other text'
  },
  loadAsyncValues: async (hint) => {
    return await new Promise<InputSelectValue[]>((resolve) => {
      setTimeout(() => {
        resolve(fakeSearch(hint))
      }, 1000)
    })
  }
}

/**
 * Options can be grouped by passing an array of objects with `label` and `options` properties.
 */
export const GroupedOptions = Template.bind({})
GroupedOptions.args = {
  label: 'Select a Country',
  initialValues: [
    {
      label: 'Europe',
      options: [
        { label: 'France', value: 'fr' },
        { label: 'Italy', value: 'it', isDisabled: true },
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

/**
 * Options group can be separated by an horizontal line when group label is `undefined`.
 * Separator won't be rendered for the first group.
 */
export const WithSeparator = Template.bind({})
WithSeparator.args = {
  label: 'Select a currency',
  initialValues: currencyInputSelectOptions,
  placeholder: 'Type to filter list...',
  isMulti: true,
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

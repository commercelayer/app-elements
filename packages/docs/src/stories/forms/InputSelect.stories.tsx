import { Label } from '#ui/forms/Label'
import {
  InputSelect,
  InputSelectProps,
  SelectValue
} from '#ui/forms/InputSelect'
import { Hint } from '#ui/atoms/Hint'
import { Spacer } from '#ui/atoms/Spacer'
import { Container } from '#ui/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
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

const setup: ComponentMeta<typeof InputSelect> = {
  title: 'Forms/InputSelect',
  component: InputSelect,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputSelect> = (args) => {
  return (
    <Container minHeight={false}>
      <Label gap htmlFor='parent-resource'>
        Search resource
      </Label>
      <InputSelect {...args} />

      {args.loadAsyncValues !== undefined ? (
        <Spacer top='6'>
          <Hint icon='bulb'>
            Try to search some of the following values: customer, sku, price,
            tax
          </Hint>
        </Spacer>
      ) : null}
    </Container>
  )
}

export const Simple = Template.bind({})
Simple.args = {
  initialValues: fullList,
  placeholder: 'Type to filter list...',
  isSearchable: true,
  isClearable: false
}

export const Async = Template.bind({})
Async.args = {
  placeholder: 'Type to search async...',
  isSearchable: true,
  isClearable: false,
  loadAsyncValues: async (hint) => {
    return await new Promise<SelectValue[]>((resolve) => {
      setTimeout(() => {
        resolve(fakeSearch(hint))
      }, 1000)
    })
  }
}

const fakeSearch = (hint: string): SelectValue[] =>
  fullList.filter((item) =>
    item.label.toLowerCase().includes(hint.toLowerCase())
  )

const TemplateError: ComponentStory<typeof InputSelect> = (args) => {
  const [feedback, setFeedback] = useState<InputSelectProps['feedback']>()
  return (
    <Container minHeight={false}>
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
    </Container>
  )
}
export const WithError = TemplateError.bind({})

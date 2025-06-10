import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { Card } from '#ui/atoms/Card'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import {
  ResourceLineItems,
  type ResourceLineItemsProps
} from '#ui/resources/ResourceLineItems'
import { presetLineItems } from '#ui/resources/ResourceLineItems/ResourceLineItems.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

type Props = ResourceLineItemsProps & {
  preset: Array<keyof typeof presetLineItems | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Resources/ResourceLineItems',
  component: ResourceLineItems,
  argTypes: {
    preset: {
      options: ['custom', ...Object.keys(presetLineItems)],
      control: { type: 'check' },
      description: `⚠️ This attribute is **not** a component prop.
        It is meant to be used only within this documentation.
        You can quickly switch to a pre-configured \`lineItem\`.
      `,
      defaultValue: ['custom']
    }
  },
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<Props> = ({ preset, items, ...args }) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceLineItems
          {...args}
          items={[
            ...(preset.includes('custom') ? items : []),
            ...preset
              .filter(
                (p): p is Exclude<Props['preset'][number], 'custom'> =>
                  p !== 'custom'
              )
              .map((p) => presetLineItems[p])
          ]}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

const footer: Props['footer'] = [
  {
    key: 'first-row',
    element: (
      <ListItem borderStyle='none' padding='y' paddingSize='2'>
        <Text>Coupon</Text>
        <Button variant='link'>Add coupon</Button>
      </ListItem>
    )
  },
  {
    key: 'second-row',
    element: (
      <>
        <ListItem borderStyle='none' padding='y' paddingSize='2'>
          <Text>Subtotal</Text>
          <Text>$141.60</Text>
        </ListItem>
        <ListItem borderStyle='none' padding='y' paddingSize='2'>
          <Text>Shipping method</Text>
          <Text>$12.00</Text>
        </ListItem>
        <ListItem borderStyle='none' padding='y' paddingSize='2'>
          <Text weight='bold'>Total</Text>
          <Text weight='bold'>$163.60</Text>
        </ListItem>
      </>
    )
  }
]

export const Default = Template.bind({})
Default.args = {
  preset: ['custom'],
  isLoading: false,
  items: [{ ...presetLineItems.oneLine, id: 'nIp9785zse' }],
  footer,
  onChange() {
    alert('Something has changed!')
  }
}

export const Simple = Template.bind({})
Simple.args = {
  preset: ['oneLine']
}

export const WithDiscountBreakdown = Template.bind({})
WithDiscountBreakdown.args = {
  preset: ['withDiscountBreakdown']
}

export const WithTaxes = Template.bind({})
WithTaxes.args = {
  preset: ['withTaxes'],
  isTaxIncluded: true
}

export const WithLineItemOptions = Template.bind({})
WithLineItemOptions.args = {
  preset: ['withOptions']
}

export const WithBundle = Template.bind({})
WithBundle.args = {
  preset: ['withBundle']
}

export const WithGiftCard = Template.bind({})
WithGiftCard.args = {
  preset: ['giftCardBought', 'giftCardUsed']
}

export const ParcelLineItem = Template.bind({})
ParcelLineItem.args = {
  preset: ['parcelLineItem']
}

export const StockLineItem = Template.bind({})
StockLineItem.args = {
  preset: ['stockLineItem', 'stockLineItemWithStockTransfer']
}

export const ReturnLineItem = Template.bind({})
ReturnLineItem.args = {
  preset: ['returnLineItem']
}

export const List: StoryFn<Props> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceLineItems
          {...args}
          items={Object.values(presetLineItems)}
          footer={footer}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const EditableList = List.bind({})
EditableList.args = {
  editable: true,
  onChange() {
    alert('Something has changed!')
  }
}

/**
 * You can make line items swappable by setting and managing the `onSwap` method.
 */
export const SwappableItem = List.bind({})
SwappableItem.args = {
  editable: true,
  onChange() {
    alert('Something has changed!')
  },
  onSwap(lineItem) {
    alert(`Swap item #${lineItem.id}`)
  }
}

/**
 * When there's only one editable item in the order and the `onSwap` method is defined, you'll not be able to remove the item (`remove` action is disabled).
 * When `onSwap` method is not defined, the item can be removed, even if it is the last one.
 */
export const RemoveDisabled: StoryFn<Props> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceLineItems
          {...args}
          items={[presetLineItems.oneLine]}
          footer={footer}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}
RemoveDisabled.args = {
  editable: true,
  onChange() {
    alert('Something has changed!')
  },
  onSwap(lineItem) {
    alert(`Swap item #${lineItem.id}`)
  }
}

/**
 * When the ResourcelLineItems lives within a `<Card />` component it avoid render the last border.
 */
export const WithinACard: StoryFn<Props> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <Spacer bottom='4'>
          <Card overflow='visible'>
            <ResourceLineItems {...args} items={[presetLineItems.oneLine]} />
          </Card>
        </Spacer>

        <Card overflow='visible'>
          <ResourceLineItems
            {...args}
            items={[presetLineItems.oneLine]}
            footer={footer}
          />
        </Card>
      </CoreSdkProvider>
    </TokenProvider>
  )
}
WithinACard.parameters = {
  backgrounds: { default: 'overlay' }
}
WithinACard.args = {
  editable: true
}

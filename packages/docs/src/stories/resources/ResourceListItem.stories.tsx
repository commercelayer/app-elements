import type { Meta, StoryFn } from "@storybook/react-vite"
import { Icon } from "#ui/atoms/Icon"
import { Dropdown } from "#ui/composite/Dropdown"
import { DropdownItem } from "#ui/composite/Dropdown/DropdownItem"
import { ResourceListItem } from "#ui/resources/ResourceListItem"
import { presetResourceListItem } from "#ui/resources/ResourceListItem/ResourceListItem.mocks"
import type { ResourceListItemType } from "#ui/resources/ResourceListItem/types"

type Props = Parameters<typeof ResourceListItem>[0] & {
  preset: Array<keyof typeof presetResourceListItem | "custom">
}

const setup: Meta<Props> = {
  title: "Resources/ResourceListItem",
  component: ResourceListItem,
  argTypes: {
    preset: {
      options: ["custom", ...Object.keys(presetResourceListItem)],
      control: { type: "check" },
      description: `⚠️ This attribute is **not** a component prop.
        It is meant to be used only within this documentation.
        You can quickly switch to a pre-configured \`ResourceLineItem\`.
      `,
      defaultValue: ["custom"],
    },
  },
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<Props> = ({ preset, resource, ...args }) => {
  return (
    <>
      {[
        ...(preset.includes("custom") ? [resource] : []),
        ...preset.filter(
          (p): p is Exclude<Props["preset"][number], "custom"> =>
            p !== "custom",
        ),
      ].map((p, idx) => {
        return (
          <ResourceListItem
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
            key={idx}
            {...args}
            resource={typeof p === "string" ? presetResourceListItem[p] : p}
          />
        )
      })}
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  preset: ["custom"],
  resource: {
    ...presetResourceListItem.orderAwaitingApproval,
    id: "nIp9785zse",
  },
  onClick() {
    alert("The item was clicked!")
  },
}

type ListProps = Props & {
  type: Array<ResourceListItemType["type"]>
}

const ItemsByTypeTemplate: StoryFn<ListProps> = (args) => {
  return (
    <>
      {Object.values(presetResourceListItem)
        .filter((preset) => args.type.includes(preset.type))
        .map((preset, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
          <ResourceListItem key={idx} resource={preset} />
        ))}
    </>
  )
}

/**
 * An order row: its number with the status as a badge, when it was placed, and
 * what it came to. No icon — these rows are listed inside the resource they
 * belong to, which already says whose orders they are.
 *
 * `actions` puts a menu at the far right, where a clickable row would otherwise
 * have been (see `useResourceList`'s boxed variant for the whole block).
 */
export const Orders = ItemsByTypeTemplate.bind({})
Orders.args = {
  type: ["orders"],
}

export const Returns = ItemsByTypeTemplate.bind({})
Returns.args = {
  type: ["returns"],
}

export const StockTransfers = ItemsByTypeTemplate.bind({})
StockTransfers.args = {
  type: ["stock_transfers"],
}

export const Customers = ItemsByTypeTemplate.bind({})
Customers.args = {
  type: ["customers"],
}

export const Shipments = ItemsByTypeTemplate.bind({})
Shipments.args = {
  type: ["shipments"],
}

export const SkuListItems = ItemsByTypeTemplate.bind({})
SkuListItems.args = {
  type: ["sku_list_items"],
}

export const Promotions = ItemsByTypeTemplate.bind({})
Promotions.args = {
  type: [
    "buy_x_pay_y_promotions",
    "external_promotions",
    "fixed_amount_promotions",
    "fixed_price_promotions",
    "free_gift_promotions",
    "free_shipping_promotions",
    "percentage_discount_promotions",
    "flex_promotions",
  ],
}

/**
 * `actions` puts a menu at the far right of the row, where a clickable row would
 * otherwise have taken the reader somewhere.
 *
 * Give the row a menu **or** make it clickable, not both: two ways to open the
 * same thing invite the wrong one. Where the menu holds a link, pass an `href`
 * (here through `useAppLinking`'s `navigateTo` in a real app) so cmd- and
 * middle-click still open it in a new tab.
 */
export const WithActions: StoryFn = () => (
  <ResourceListItem
    resource={presetResourceListItem.orderFulfilled}
    actions={
      <Dropdown
        dropdownLabel={<Icon name="dotsThree" size={24} />}
        dropdownItems={
          <>
            <DropdownItem label="View order" href="#" />
            <DropdownItem label="Copy order number" onClick={() => {}} />
          </>
        }
      />
    }
  />
)

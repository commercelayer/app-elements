import type { Meta, StoryFn } from "@storybook/react-vite"
import { Card } from "#ui/atoms/Card"
import { Icon } from "#ui/atoms/Icon"
import { Dropdown } from "#ui/composite/Dropdown"
import { DropdownItem } from "#ui/composite/Dropdown/DropdownItem"
import { ListContext } from "#ui/internals/listContext"
import { ResourceListItem } from "#ui/resources/ResourceListItem"
import { presetResourceListItem } from "#ui/resources/ResourceListItem/ResourceListItem.mocks"
import type { ResourceListItemType } from "#ui/resources/ResourceListItem/types"

type Props = Parameters<typeof ResourceListItem>[0] & {
  preset: Array<keyof typeof presetResourceListItem | "custom">
}

/** The resource types the component is still used for: the others are deprecated. */
const supportedTypes: Array<ResourceListItemType["type"]> = [
  "orders",
  "returns",
  "shipments",
  "sku_list_items",
]

const supportedPresets = Object.entries(presetResourceListItem)
  .filter(([, preset]) => supportedTypes.includes(preset.type))
  .map(([key]) => key)

const setup: Meta<Props> = {
  title: "Resources/ResourceListItem",
  component: ResourceListItem,
  argTypes: {
    preset: {
      options: ["custom", ...supportedPresets],
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
 * Clickable, the row can show a caret after the total (see `Clickable`); with
 * `actions`, a menu sits at the far right instead (see `useResourceList`'s boxed
 * variant for the whole block).
 */
export const Orders = ItemsByTypeTemplate.bind({})
Orders.args = {
  type: ["orders"],
}

export const Returns = ItemsByTypeTemplate.bind({})
Returns.args = {
  type: ["returns"],
}

export const Shipments = ItemsByTypeTemplate.bind({})
Shipments.args = {
  type: ["shipments"],
}

export const SkuListItems = ItemsByTypeTemplate.bind({})
SkuListItems.args = {
  type: ["sku_list_items"],
}

/**
 * A row with an `href` (or `onClick`) is clickable as a whole, and shows a caret
 * at the end of the row, after the right content, like an order's total, so the
 * reader can tell the row leads somewhere. A row with `actions` leaves it out:
 * the menu takes its place.
 *
 * In a real app, pass `useAppLinking`'s `navigateTo` to get both the `href` and
 * the `onClick`, so cmd- and middle-click still open it in a new tab.
 */
export const Clickable: StoryFn = () => (
  <>
    <ResourceListItem
      resource={presetResourceListItem.orderAwaitingApproval}
      href="#"
    />
    <ResourceListItem
      resource={presetResourceListItem.orderFulfilled}
      href="#"
    />
    <ResourceListItem
      resource={presetResourceListItem.orderCancelled}
      href="#"
    />
  </>
)

const clickableInBoxedListPresets = [
  "orderAwaitingApproval",
  "orderFulfilled",
  "orderCancelled",
] as const

/**
 * The same clickable rows inside a boxed list, a list nested in a parent
 * resource's page, as `useResourceList` renders it with `variant="boxed"`: a
 * gray card where the rows separate with a dashed rule, left out on the last
 * row since the card's edge already closes the group.
 *
 * The rows take no prop for any of it: they read the list's `ListContext`,
 * which this story provides per row the same way `useResourceList` does.
 */
export const ClickableInBoxedList: StoryFn = () => (
  <Card gap="1" overflow="visible" backgroundColor="light" className="px-6">
    {clickableInBoxedListPresets.map((preset, index) => (
      <ListContext.Provider
        key={preset}
        value={{
          boxed: true,
          isLastRow: index === clickableInBoxedListPresets.length - 1,
        }}
      >
        <ResourceListItem resource={presetResourceListItem[preset]} href="#" />
      </ListContext.Provider>
    ))}
  </Card>
)

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

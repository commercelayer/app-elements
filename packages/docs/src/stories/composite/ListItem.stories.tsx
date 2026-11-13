import type { Meta, StoryFn } from "@storybook/react-vite"
import { Avatar } from "#ui/atoms/Avatar"
import { Badge, type BadgeProps } from "#ui/atoms/Badge"
import { Button } from "#ui/atoms/Button"
import { Card } from "#ui/atoms/Card"
import { Icon } from "#ui/atoms/Icon"
import { RadialProgress } from "#ui/atoms/RadialProgress"
import { StatusIcon } from "#ui/atoms/StatusIcon"
import { Text } from "#ui/atoms/Text"
import { ListItem } from "#ui/composite/ListItem"
import { ListContext } from "#ui/internals/listContext"

const setup: Meta<typeof ListItem> = {
  title: "Composite/ListItem",
  component: ListItem,
  parameters: {
    layout: "padded",
  },
}
export default setup

export const Simple: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <Text weight="bold">Skus</Text>
    <StatusIcon name="caretRight" />
  </ListItem>
)
Simple.args = {
  onClick: () => {
    alert("clicked")
  },
}

interface OrderRow {
  number: string
  status: { label: string; variant: BadgeProps["variant"] }
  date: string
  total: string
}

const inProgressOrderRow: OrderRow = {
  number: "#2805786",
  status: { label: "in progress", variant: "warning" },
  date: "Today, 08:58",
  total: "$100,00",
}

const orderRows: OrderRow[] = [
  inProgressOrderRow,
  {
    number: "#2805672",
    status: { label: "fulfilled", variant: "success" },
    date: "May 21, 12:56",
    total: "$390,65",
  },
  {
    number: "#2805786",
    status: { label: "cancelled", variant: "secondary" },
    date: "May 13, 18:22",
    total: "$100,00",
  },
]

/**
 * An order's row as `ResourceListItem` draws it: its number with the status as a
 * badge and when it was placed, then what it came to and a muted caret when the
 * row leads somewhere. Two components, as `ListItem` lays out its children side
 * by side and a fragment would count as one.
 */
const OrderRowSummary = ({ row }: { row: OrderRow }): React.JSX.Element => (
  <div>
    <div className="flex items-center gap-2 leading-6">
      <Text tag="div" weight="semibold" size="small">
        Order {row.number}
      </Text>
      <Badge variant={row.status.variant}>{row.status.label}</Badge>
    </div>
    <Text tag="div" weight="medium" size="x-small" variant="info">
      {row.date}
    </Text>
  </div>
)

const OrderRowTotal = ({
  row,
  showCaret,
}: {
  row: OrderRow
  showCaret: boolean
}): React.JSX.Element => (
  <div className="flex items-center gap-2">
    <Text tag="div" weight="semibold">
      {row.total}
    </Text>
    {showCaret && (
      <Icon
        name="caretRight"
        size={16}
        className="shrink-0 ml-2 text-gray-400"
      />
    )}
  </div>
)

const WithIconTemplate: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <OrderRowSummary row={inProgressOrderRow} />
    <OrderRowTotal
      row={inProgressOrderRow}
      showCaret={
        args.disabled !== true && (args.href != null || args.onClick != null)
      }
    />
  </ListItem>
)

export const WithIcon = WithIconTemplate.bind({})
WithIcon.args = {
  icon: <StatusIcon name="arrowDown" background="orange" gap="large" />,
}

export const BorderDashed = WithIconTemplate.bind({})
BorderDashed.args = {
  borderStyle: "dashed",
}

export const Boxed = WithIconTemplate.bind({})
Boxed.args = {
  onClick: () => {},
  variant: "boxed",
}

/**
 * A boxed list is a list nested in a parent resource's page, as `ResourceList`
 * renders it with `variant="boxed"`: the rows go in a gray card and separate
 * with a dashed rule, left out on the last row since the card's edge already
 * closes the group. Clickable rows react to the pointer by fading their content,
 * leaving the card's gray untouched.
 *
 * The rows take no prop for any of it: they read the list's `ListContext`,
 * which this story provides per row the same way `ResourceList` does. Use the
 * controls to see how the rows react to `onClick`, `borderStyle` or `paddingSize`.
 */
export const InBoxedList: StoryFn<typeof ListItem> = (args) => (
  <Card gap="1" overflow="visible" backgroundColor="light" className="px-6">
    {orderRows.map((row, index) => (
      <ListContext.Provider
        key={row.date}
        value={{ boxed: true, isLastRow: index === orderRows.length - 1 }}
      >
        <ListItem {...args}>
          <OrderRowSummary row={row} />
          <OrderRowTotal
            row={row}
            showCaret={args.href != null || args.onClick != null}
          />
        </ListItem>
      </ListContext.Provider>
    ))}
  </Card>
)
InBoxedList.args = {
  onClick: () => {},
}

const BoxedCTATemplate: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <Text>
      Enable flexible price adjustments based on the quantities purchased.
    </Text>
    <Button variant="secondary" size="small" alignItems="center">
      <Icon name="plus" size={16} />
      Volume tier
    </Button>
  </ListItem>
)

export const BoxedCTA = BoxedCTATemplate.bind({})
BoxedCTA.args = {
  icon: <Icon name="stack" size={32} />,
  alignIcon: "center",
  variant: "boxed",
  paddingSize: "6",
}

export const Disabled = WithIconTemplate.bind({})
Disabled.args = {
  onClick: () => {},
  variant: "boxed",
  disabled: true,
}

export const WithCenteredIcon = WithIconTemplate.bind({})
WithCenteredIcon.args = {
  icon: <StatusIcon name="arrowDown" background="orange" gap="large" />,
  alignIcon: "center",
}

export const AsAnchor = WithIconTemplate.bind({})
AsAnchor.args = {
  href: "#",
}

export const OrderLine: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args}>
    <div>
      <Text size="small" weight="medium" variant="info" tag="div">
        SKU 543289
      </Text>
      <Text tag="div" weight="bold">
        Black Baby Short Sleeve with pink logo 12 months size XL
      </Text>
    </div>
    <Text weight="medium" variant="info" tag="div" wrap="nowrap">
      $69,50 x 2
    </Text>
    <Text weight="bold" tag="div" wrap="nowrap">
      $139,00
    </Text>
  </ListItem>
)
OrderLine.args = {
  padding: "y",
  icon: (
    <Avatar
      src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png"
      alt="Black Hat"
    />
  ),
}

export const Task: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args} icon={<RadialProgress percentage={45} />}>
    <div>
      <Text tag="div" weight="semibold">
        Prices
      </Text>
      <Text tag="div" size="small" variant="info" weight="medium">
        Importing 35%
      </Text>
    </div>
    <StatusIcon name="caretRight" />
  </ListItem>
)

export const Pending: StoryFn<typeof ListItem> = (args) => (
  <ListItem {...args} icon={<RadialProgress icon="cloudArrowUp" />}>
    <div>
      <Text tag="div" weight="semibold">
        Prices
      </Text>
      <Text tag="div" size="small" variant="info" weight="medium">
        Importing 35%
      </Text>
    </div>
    <StatusIcon name="caretRight" />
  </ListItem>
)

import {
  Description,
  Primary,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks"
import type { Meta, StoryFn } from "@storybook/react-vite"
import type { JSX } from "react"
import { Card } from "#ui/atoms/Card"
import { Grid } from "#ui/atoms/Grid"
import { Spacer } from "#ui/atoms/Spacer"
import { StatusIcon } from "#ui/atoms/StatusIcon"
import { Text } from "#ui/atoms/Text"
import type { ListItem } from "#ui/composite/ListItem"

const setup: Meta = {
  title: "Examples/Panel",
  parameters: {
    layout: "padded",
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
        </>
      ),
    },
  },
}
export default setup

export const Default: StoryFn<typeof ListItem> = (_args): JSX.Element => (
  <Grid columns="2">
    <Card href="https://example.com" overflow="visible">
      <StatusIcon name="percent" background="black" gap="medium" />
      <Spacer top="4">
        <Text weight="semibold">Percentage discount</Text>
        <Text tag="div" size="small" variant="info">
          Apply a specific percentage discount to the subtotal amount of orders.
        </Text>
      </Spacer>
    </Card>

    <Card href="https://example.com" overflow="visible">
      <StatusIcon name="truck" background="black" gap="medium" />
      <Spacer top="4">
        <Text weight="semibold">Free shipping</Text>
        <Text tag="div" size="small" variant="info">
          Set the shipping cost amount to zero for orders.
        </Text>
      </Spacer>
    </Card>
  </Grid>
)

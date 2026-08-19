import {
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks"
import type { Meta, StoryFn } from "@storybook/react-vite"
import { Badge } from "#ui/atoms/Badge"
import { Button } from "#ui/atoms/Button"
import { Spacer } from "#ui/atoms/Spacer"
import { Stack, StackCell } from "#ui/atoms/Stack"
import { Text } from "#ui/atoms/Text"

const setup: Meta<typeof Stack> = {
  title: "Atoms/Stack",
  component: Stack,
  parameters: {
    layout: "padded",
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
}
export default setup

export const Default: StoryFn<typeof Stack> = (args) => (
  <Stack {...args}>
    <div>Element 1</div>
    <div>Element 2</div>
    <div>Element 3</div>
  </Stack>
)
Default.args = {}

export const Steps: StoryFn<typeof Stack> = (args) => (
  <Stack {...args}>
    <div>
      <Spacer bottom="2">
        <Text tag="div" variant="info" size="small" weight="semibold">
          Order
        </Text>
      </Spacer>
      <Badge variant="success-solid">APPROVED</Badge>
    </div>
    <div>
      <Spacer bottom="2">
        <Text tag="div" variant="info" size="small" weight="semibold">
          Payment
        </Text>
      </Spacer>
      <Badge variant="secondary">AUTHORIZED</Badge>
    </div>
    <div>
      <Spacer bottom="2">
        <Text tag="div" variant="info" size="small" weight="semibold">
          Fulfillment
        </Text>
      </Spacer>
      <Badge variant="secondary">UNFULFILLED</Badge>
    </div>
  </Stack>
)
Steps.args = {}

export const Addresses: StoryFn<typeof Stack> = (args) => (
  <Stack {...args}>
    <div>
      <Spacer bottom="2">
        <Text tag="div" weight="semibold">
          Shipping address
        </Text>
      </Spacer>
      <Text tag="div" variant="info">
        Jack Kein
        <br />
        1209 Orange Street
        <br />
        Wilmington DE 19801 (US)
      </Text>
      <Spacer top="4">
        <Button variant="link">Edit</Button>
      </Spacer>
    </div>
    <div>
      <Spacer bottom="2">
        <Text tag="div" weight="bold">
          Billing address
        </Text>
      </Spacer>
      <Text tag="div" variant="info">
        Jack Kein
        <br />
        1209 Orange Street
        <br />
        Wilmington DE 19801 (US)
      </Text>
      <Spacer top="4">
        <Button variant="link">Edit</Button>
      </Spacer>
    </div>
  </Stack>
)
Addresses.args = {}

/**
 * By using multiple `Stack` components it's possible to make a grid. Border top won't be duplicated.
 *
 * However it's always suggested, but not required, to group them in a parent `div` since the `nth+1` sibling will have a negative `1px` margin-top.
 */
export const MultipleStacks: StoryFn<typeof Stack> = (_args) => (
  <>
    <div>first sibling</div>
    <Stack>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </Stack>
    <Stack>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </Stack>
    <Stack>
      <div>7</div>
      <div>8</div>
    </Stack>
    <div>last sibling</div>
  </>
)

/** `StackCell` writes the label and the value, taking its type sizes from the stack. */
export const WithCells: StoryFn<typeof Stack> = (args) => (
  <div>
    <Stack {...args}>
      <StackCell label="Discount">1%</StackCell>
      <StackCell label="Usage">0</StackCell>
      <StackCell label="Coupons">0</StackCell>
    </Stack>
    <Stack {...args}>
      <StackCell label="Started on">Jan 19, 2027, 23:00</StackCell>
      <StackCell label="Expires on">Mar 17, 2027, 23:00</StackCell>
      <StackCell label="Apply to" />
    </Stack>
  </div>
)
WithCells.args = {}

/**
 * `small` tightens the padding and shrinks the type. Once the cells sit side by side
 * the trailing one reads from the right edge; narrower than that they stack and all
 * align to the left.
 */
export const Small: StoryFn<typeof Stack> = () => (
  <div>
    <Stack size="small">
      <StackCell label="Discount">10%</StackCell>
      <StackCell label="Coupons">592</StackCell>
    </Stack>
    <Stack size="small">
      <StackCell label="Started on">May 12, 12:00</StackCell>
      <StackCell label="Expires on">May 24, 12:00</StackCell>
    </Stack>
    <Stack size="small">
      <StackCell label="Usage">23/500</StackCell>
      <StackCell label="Apply to">All products in the order</StackCell>
    </Stack>
  </div>
)

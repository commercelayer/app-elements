import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { Avatar } from "#ui/atoms/Avatar"
import { Text } from "#ui/atoms/Text"
import { Input } from "#ui/forms/Input"
import { InputCheckboxGroup } from "#ui/forms/InputCheckboxGroup"

const setup: Meta<typeof InputCheckboxGroup> = {
  title: "Forms/ui/InputCheckboxGroup",
  component: InputCheckboxGroup,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof InputCheckboxGroup> = (args) => {
  const [values, setValues] = useState(args.defaultValues)
  return (
    <InputCheckboxGroup {...args} defaultValues={values} onChange={setValues} />
  )
}

export const Default = Template.bind({})
Default.args = {
  title: "Items",
  defaultValues: [
    {
      value: "BABYBIBXA19D9D000000XXXX",
    },
    {
      value: "BASEBHAT000000FFFFFFXXXX",
    },
  ],
  options: [
    {
      value: "BABYBIBXA19D9D000000XXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png"
          alt="Gray Baby Bib with Black Logo"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Gray Baby Bib with Black Logo
          </Text>
          <Text size="small" tag="div" variant="info">
            200g
          </Text>
        </div>
      ),
    },
    {
      value: "BASEBHAT000000FFFFFFXXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png"
          alt="Black Baseball Hat with White Logo"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Black Baseball Hat with White Logo
          </Text>
          <Text size="small" tag="div" variant="info">
            50g
          </Text>
        </div>
      ),
    },
    {
      value: "HOODIEUL000000FFFFFFLXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png"
          alt="Black Unisex Lightweight Hoodie"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Black Unisex Lightweight Hoodie
          </Text>
          <Text size="small" tag="div" variant="info">
            150g
          </Text>
        </div>
      ),
    },
  ],
}

/**
 * Each option in the following example has a quantity range (min, max) specified.
 * Default (initial) values should also have a quantity value set. If missing, the max value will be used.
 * <span title="Quantity range" type="info">
 * The first item listed below has an allowed quantity range of min 2, max 6.
 * So you won't be able to select 1 or 7, but you can still deselect the entire item.
 * </span>
 */
export const WithQuantity = Template.bind({})
WithQuantity.args = {
  title: "Items",
  defaultValues: [
    {
      value: "BABYBIBXA19D9D000000XXXX",
      quantity: 4,
    },
    {
      value: "BASEBHAT000000FFFFFFXXXX",
      quantity: 7,
    },
  ],
  options: [
    {
      value: "BABYBIBXA19D9D000000XXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png"
          alt="Gray Baby Bib with Black Logo"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Gray Baby Bib with Black Logo
          </Text>
          <Text size="small" tag="div" variant="info">
            200g
          </Text>
        </div>
      ),
      quantity: {
        min: 2,
        max: 6,
      },
    },
    {
      value: "BASEBHAT000000FFFFFFXXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png"
          alt="Black Baseball Hat with White Logo"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Black Baseball Hat with White Logo
          </Text>
          <Text size="small" tag="div" variant="info">
            50g
          </Text>
        </div>
      ),
      quantity: {
        min: 1,
        max: 7,
      },
    },
    {
      value: "HOODIEUL000000FFFFFFLXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png"
          alt="Black Unisex Lightweight Hoodie"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Black Unisex Lightweight Hoodie
          </Text>
          <Text size="small" tag="div" variant="info">
            150g
          </Text>
        </div>
      ),
      quantity: {
        min: 1,
        max: 8,
      },
    },
    {
      value: "TOTEBAGLE7DDC7000000XXXX",
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Large Eco Tote Bag with Black Logo
          </Text>
        </div>
      ),
      quantity: {
        min: 1,
        max: 5,
      },
    },
    {
      value: "DHL",
      icon: (
        <Avatar
          size="small"
          shape="circle"
          border="none"
          src="carriers:dhl"
          alt="DHL"
        />
      ),
      content: (
        <>
          <div>
            <Text size="regular" weight="bold">
              Express Easy
            </Text>
            <Text size="small" tag="div" variant="info" weight="medium">
              DHL Express
            </Text>
          </div>
          <Text size="regular" weight="bold" wrap="nowrap">
            €37,61
          </Text>
        </>
      ),
      quantity: {
        min: 1,
        max: 5,
      },
    },
  ],
}

export const WithCheckedElement = Template.bind({})
WithCheckedElement.args = {
  title: "Items",
  defaultValues: [
    {
      value: "BABYBIBXA19D9D000000XXXX",
      quantity: 1,
    },
    {
      value: "BASEBHAT000000FFFFFFXXXX",
    },
  ],
  options: [
    {
      value: "BABYBIBXA19D9D000000XXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png"
          alt="Gray Baby Bib with Black Logo"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Gray Baby Bib with Black Logo
          </Text>
          <Text size="small" tag="div" variant="info">
            200g
          </Text>
        </div>
      ),
      checkedElement: <Input placeholder="Reason" />,
      quantity: {
        min: 2,
        max: 6,
      },
    },
    {
      value: "BASEBHAT000000FFFFFFXXXX",
      icon: (
        <Avatar
          size="small"
          src="https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png"
          alt="Black Baseball Hat with White Logo"
        />
      ),
      content: (
        <div>
          <Text size="regular" tag="div" weight="bold">
            Black Baseball Hat with White Logo
          </Text>
          <Text size="small" tag="div" variant="info">
            50g
          </Text>
        </div>
      ),
      checkedElement: <Input placeholder="Reason" />,
    },
  ],
}

export const WithErrors = Template.bind({})
WithErrors.args = {
  ...Default.args,
  feedback: {
    message: "Please select",
    variant: "danger",
  },
}

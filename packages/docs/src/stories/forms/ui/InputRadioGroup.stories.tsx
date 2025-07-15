import type { Meta, StoryFn } from "@storybook/react-vite"
import { Avatar } from "#ui/atoms/Avatar"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { ListItem } from "#ui/composite/ListItem"
import { InputRadioGroup } from "#ui/forms/InputRadioGroup"
import { InputSelect } from "#ui/forms/InputSelect"

const setup: Meta<typeof InputRadioGroup> = {
  title: "Forms/ui/InputRadioGroup",
  component: InputRadioGroup,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof InputRadioGroup> = (args) => {
  return <InputRadioGroup {...args} />
}

export const Default = Template.bind({})
Default.args = {
  title: "Select a Rate",
  name: "carrier",
  onChange: (v) => {
    console.log(v)
  },
  options: [
    {
      value: "DHL1",
      content: (
        <ListItem
          alignItems="top"
          alignIcon="center"
          borderStyle="none"
          padding="none"
          icon={
            <Avatar
              size="small"
              shape="circle"
              border="none"
              src="carriers:dhl"
              alt="DHL"
            />
          }
        >
          <div>
            <Text size="regular" weight="bold">
              Domestic Express · 48h
            </Text>
            <Text size="small" tag="div" variant="info" weight="medium">
              DHL Express
            </Text>
          </div>
          <Text size="regular" weight="bold" wrap="nowrap">
            €7,41
          </Text>
        </ListItem>
      ),
    },
    {
      value: "Fedex",
      content: (
        <ListItem
          alignItems="top"
          alignIcon="center"
          borderStyle="none"
          padding="none"
          icon={
            <Avatar
              size="small"
              shape="circle"
              border="none"
              src="carriers:fedex"
              alt="Fedex"
            />
          }
        >
          <div>
            <Text size="regular" weight="bold">
              Express Pro · 48h
            </Text>
            <Text size="small" tag="div" variant="info" weight="medium">
              Fedex
            </Text>
          </div>
          <Text size="regular" weight="bold" wrap="nowrap">
            $12,00
          </Text>
        </ListItem>
      ),
    },
    {
      value: "DHL2",
      content: (
        <ListItem
          alignItems="top"
          alignIcon="center"
          borderStyle="none"
          padding="none"
          icon={
            <Avatar
              size="small"
              shape="circle"
              border="none"
              src="carriers:dhl"
              alt="DHL"
            />
          }
        >
          <div>
            <Text size="regular" weight="bold">
              Domestic Express 1200 · 24h
            </Text>
            <Text size="small" tag="div" variant="info" weight="medium">
              DHL Express
            </Text>
          </div>
          <Text size="regular" weight="bold" wrap="nowrap">
            €37,61
          </Text>
        </ListItem>
      ),
    },
  ],
}

export const ViewModeInline = Template.bind({})
ViewModeInline.args = {
  title: "Choose a box",
  name: "package",
  viewMode: "inline",
  showInput: false,
  onChange: (v) => {
    console.log(v)
  },
  options: [
    {
      value: "medium",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Medium box
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            20 × 30 × 40 cm
          </Text>
        </>
      ),
    },
    {
      value: "large",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Large box
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            40 × 60 × 80 cm
          </Text>
        </>
      ),
    },
  ],
}

export const ViewModeGrid = Template.bind({})
ViewModeGrid.args = {
  title: "Choose a box",
  name: "package",
  viewMode: "grid",
  showInput: false,
  onChange: (v) => {
    console.log(v)
  },
  options: [
    {
      value: "small",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Small box
            </Text>
            <Text tag="div" size="small" weight="bold" variant="info">
              Fragile
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            10 × 20 × 20 cm
          </Text>
        </>
      ),
    },
    {
      value: "medium",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Medium box
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            20 × 30 × 40 cm
          </Text>
        </>
      ),
    },
    {
      value: "large",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Large box
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            40 × 60 × 80 cm
          </Text>
        </>
      ),
    },
  ],
}

export const ViewModeSimple = Template.bind({})
ViewModeSimple.args = {
  title: "Choose a store",
  name: "option",
  viewMode: "simple",
  onChange: (v) => {
    console.log(v)
  },
  options: [
    {
      value: "NY",
      content: <Text weight="semibold">New York</Text>,
    },
    {
      value: "MI",
      content: <Text weight="semibold">Milan</Text>,
      checkedElement: (
        <InputSelect
          onSelect={() => {}}
          hint={{ text: "Select your preferred color." }}
          initialValues={[
            { label: "Red", value: "red" },
            { label: "Green", value: "green" },
            { label: "Blue", value: "blue" },
          ]}
        />
      ),
    },
  ],
}

/** It possible to specify a custom CSS class name for a single option item */
export const ItemCustomClassName = Template.bind({})
ItemCustomClassName.args = {
  title: "Choose a color",
  name: "package",
  viewMode: "grid",
  showInput: false,
  options: [
    {
      value: "orange",
      className: "text-orange",
      content: <div>orange</div>,
    },
    {
      value: "red",
      className: "text-red",
      content: <div>red</div>,
    },
  ],
}

export const DefaultValue = Template.bind({})
DefaultValue.args = {
  name: "package",
  viewMode: "inline",
  showInput: false,
  defaultValue: "large",
  options: [
    {
      value: "medium",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Medium box
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            20 × 30 × 40 cm
          </Text>
        </>
      ),
    },
    {
      value: "large",
      content: (
        <>
          <Spacer bottom="2">
            <Text size="regular" weight="bold">
              Large box
            </Text>
            <Text tag="div" size="small" weight="bold" variant="info">
              Extra solid
            </Text>
          </Spacer>
          <Text size="small" tag="div" variant="info" weight="medium">
            40 × 60 × 80 cm
          </Text>
        </>
      ),
    },
  ],
}

export const WithErrors = Template.bind({})
WithErrors.args = {
  ...Default.args,
  feedback: {
    message: "Please select an option",
    variant: "danger",
  },
}

export const ViewModeInlineWithErrors = Template.bind({})
ViewModeInlineWithErrors.args = {
  ...ViewModeInline.args,
  feedback: {
    message: "Please select an option",
    variant: "danger",
  },
}

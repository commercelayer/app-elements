import type { Meta, StoryFn } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import { Button } from "#ui/atoms/Button"
import { Spacer } from "#ui/atoms/Spacer"
import { HookedForm } from "#ui/forms/Form"
import { HookedInputCurrency } from "#ui/forms/InputCurrency"

const setup: Meta<typeof HookedInputCurrency> = {
  title: "Forms/react-hook-form/HookedInputCurrency",
  component: HookedInputCurrency,
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
    },
  },
}
export default setup

const Template: StoryFn<typeof HookedInputCurrency> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputCurrency {...args} />
      <Spacer top="4">
        <Button type="submit">Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: "Enter an amount",
  name: "amount",
  currencyCode: "USD",
}

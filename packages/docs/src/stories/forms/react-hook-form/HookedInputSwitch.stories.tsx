import type { Meta, StoryFn } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import { Button } from "#ui/atoms/Button"
import { Section } from "#ui/atoms/Section"
import { Spacer } from "#ui/atoms/Spacer"
import { ListItem } from "#ui/composite/ListItem"
import { HookedForm } from "#ui/forms/Form"
import { HookedInputSwitch } from "#ui/forms/InputSwitch"

const setup: Meta<typeof HookedInputSwitch> = {
  title: "Forms/react-hook-form/HookedInputSwitch",
  component: HookedInputSwitch,
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

const Template: StoryFn<typeof HookedInputSwitch> = (args) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: true,
    },
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSwitch {...args} />
      <Spacer top="4">
        <Button type="submit">Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: "soundon",
  label: "Sound on",
}

export const WithinAListItem: StoryFn = () => {
  const methods = useForm({
    defaultValues: {
      "exclude-last": true,
    },
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <Section title="More options" titleSize="small">
        <ListItem>
          <HookedInputSwitch name="export-all" label="Export all" inline />
        </ListItem>
        <ListItem>
          <HookedInputSwitch
            name="exclude-last"
            label="Exclude last"
            inline
            hint={{ text: "Exclude the last item from the export" }}
          />
        </ListItem>
      </Section>
      <Spacer top="4">
        <Button type="submit">Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

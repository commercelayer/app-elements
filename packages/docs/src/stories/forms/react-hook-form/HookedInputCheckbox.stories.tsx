import type { Meta, StoryFn } from "@storybook/react-vite"
import { type FieldErrors, useForm } from "react-hook-form"
import { Button } from "#ui/atoms/Button"
import { Spacer } from "#ui/atoms/Spacer"
import { HookedForm } from "#ui/forms/Form"
import { HookedInputCheckbox } from "#ui/forms/InputCheckbox"
import { HookedInputSelect } from "#ui/forms/InputSelect"

const setup: Meta<typeof HookedInputCheckbox> = {
  title: "Forms/react-hook-form/HookedInputCheckbox",
  component: HookedInputCheckbox,
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

const Template: StoryFn<typeof HookedInputCheckbox> = (args) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: true,
    },
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values): void => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputCheckbox {...args}>check me</HookedInputCheckbox>
      <Spacer top="4">
        <Button type="submit">Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: "myCheckboxField",
}

interface Fields {
  color_selected: boolean
  color: "red" | "green" | "blue" | null
  accept: boolean
}

export const WithCheckedElement: StoryFn = () => {
  const methods = useForm<Fields>({
    defaultValues: {
      color_selected: true,
      color: "green",
      accept: false,
    },
    resolver: async (data) => {
      const errors = new Map<string, FieldErrors<Fields>[keyof Fields]>()

      if (data.color_selected && data.color == null) {
        errors.set("color", {
          type: "required",
          message: "Color is required",
        })
      }

      if (!data.accept) {
        errors.set("accept", {
          type: "required",
          message: "You must accept",
        })
      }

      return {
        errors: Object.fromEntries(errors),
        values: data,
      }
    },
  })

  return (
    <div style={{ minHeight: "200px" }}>
      <HookedForm
        {...methods}
        onSubmit={(values): void => {
          alert(JSON.stringify(values))
        }}
      >
        <HookedInputCheckbox
          name="color_selected"
          checkedElement={
            <div>
              <HookedInputSelect
                name="color"
                hint={{ text: "Select your preferred color." }}
                initialValues={[
                  { label: "Red", value: "red" },
                  { label: "Green", value: "green" },
                  { label: "Blue", value: "blue" },
                ]}
              />
              <Spacer top="2">
                <HookedInputCheckbox name="optional_check">
                  Optional check
                </HookedInputCheckbox>
              </Spacer>
            </div>
          }
        >
          Color preference
        </HookedInputCheckbox>
        <HookedInputCheckbox name="accept">Accept</HookedInputCheckbox>
        <Spacer top="4">
          <Button type="submit">Submit</Button>
        </Spacer>
      </HookedForm>
    </div>
  )
}

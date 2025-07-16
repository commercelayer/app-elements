import type { Meta, StoryFn } from "@storybook/react-vite"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { CoreSdkProvider, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Button } from "#ui/atoms/Button"
import { Spacer } from "#ui/atoms/Spacer"
import { HookedForm } from "#ui/forms/Form"
import { HookedInputSelect, type InputSelectValue } from "#ui/forms/InputSelect"

const setup: Meta<typeof HookedInputSelect> = {
  title: "Forms/react-hook-form/HookedInputSelect",
  component: HookedInputSelect,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    ),
  ],
}
export default setup

const Template: StoryFn<typeof HookedInputSelect> = (args) => {
  const methods = useForm({
    resolver: async (data, _context) => {
      return {
        errors:
          data.city == null || data.city.length === 0
            ? { city: { type: "required", message: "City is required" } }
            : {},
        values: data,
      }
    },
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values): void => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSelect {...args} />
      <Spacer top="4">
        <Button
          type="reset"
          variant="secondary"
          onClick={() => {
            methods.reset()
          }}
        >
          Reset
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button type="submit">Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.parameters = {
  docs: {
    source: {
      type: "code",
    },
  },
}
Default.args = {
  label: "City",
  name: "city",
  initialValues: [
    {
      value: "paris",
      label: "Paris",
    },
    {
      value: "rome",
      label: "Rome",
    },
    {
      value: "london",
      label: "London",
      isDisabled: true,
    },
  ],
}

/**
 * This example shows how to use the `pathToValue` prop to store in form state
 * a value that is different from the one displayed in the select.
 * <span type="info">Here we are using storing the values of `meta.cityCode`</span>
 */
export const MultiSelect = Template.bind({})
MultiSelect.args = {
  label: "City",
  name: "city",
  isMulti: true,
  pathToValue: "meta.cityCode",
  initialValues: [
    {
      value: "paris",
      label: "Paris",
      meta: {
        cityCode: "EU_PARIS",
      },
    },
    {
      value: "rome",
      label: "Rome",
      meta: {
        cityCode: "EU_ROME",
      },
      isDisabled: true,
    },
    {
      value: "new york",
      label: "New York",
      meta: {
        cityCode: "US_NY",
      },
    },
  ],
  onSelect: (value) => {
    alert(JSON.stringify(value))
  },
}

/**
 * This example shows a multi select with the `isCreatable` prop enabled.
 */
export const MultiSelectCreatable = Template.bind({})
MultiSelectCreatable.args = {
  label: "City",
  name: "city",
  isMulti: true,
  isCreatable: true,
  placeholder: "Type to create a new city that is not in the list...",
  initialValues: [
    {
      value: "paris",
      label: "Paris",
    },
    {
      value: "new york",
      label: "New York",
    },
  ],
}

export const Clear: StoryFn<typeof HookedInputSelect> = () => {
  const methods = useForm({
    defaultValues: { city: ["paris"] },
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSelect
        name="city"
        isMulti
        label="Search resource"
        initialValues={MultiSelect.args?.initialValues ?? []}
        placeholder="Type to filter list..."
      />
      <Spacer top="4">
        <Button
          type="reset"
          variant="secondary"
          onClick={() => {
            methods.reset()
          }}
        >
          Reset
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button type="submit">Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const AsyncAllIn: StoryFn<typeof HookedInputSelect> = () => {
  const { sdkClient } = useCoreSdkProvider()
  const [initialTags, setInitialTags] = useState<InputSelectValue[] | null>(
    null,
  )
  const [defaultTags, setDefaultTags] = useState<string[]>([])

  const methods = useForm()

  useEffect(() => {
    void sdkClient.tags.list().then((tags) => {
      setInitialTags(
        tags.slice(0, 5).map((tag: any) => ({
          value: tag.id,
          label: tag.name,
        })),
      )

      setDefaultTags([tags[1]?.id, tags[3]?.id].filter((v) => v != null))
    })
  }, [])

  useEffect(() => {
    methods.reset({
      tags: defaultTags,
    })
  }, [defaultTags])

  return (
    <div
      style={{
        paddingBottom: "300px",
      }}
    >
      <HookedForm
        {...methods}
        onSubmit={(values) => {
          alert(JSON.stringify(values))
        }}
      >
        <HookedInputSelect
          name="tags"
          isMulti
          label="Search resource"
          initialValues={initialTags ?? []}
          loadAsyncValues={async (input) => {
            const tags = await sdkClient.tags.list({
              filters: { name_cont: input },
            })

            return tags.map((tag: any) => ({
              value: tag.id,
              label: tag.name,
            }))
          }}
          placeholder="Type to filter list..."
        />
        <Spacer top="4">
          <Button
            type="reset"
            variant="secondary"
            onClick={() => {
              methods.reset()
            }}
          >
            Reset
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="submit">Submit</Button>
        </Spacer>
      </HookedForm>
    </div>
  )
}

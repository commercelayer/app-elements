import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Button } from "#ui/atoms/Button"
import { Section } from "#ui/atoms/Section"
import { Spacer } from "#ui/atoms/Spacer"
import { Stack } from "#ui/atoms/Stack"
import { ListItem } from "#ui/composite/ListItem"
import { HookedForm } from "#ui/forms/Form"
import { HookedInput } from "#ui/forms/Input"
import { InputCheckbox } from "#ui/forms/InputCheckbox"
import {
  ResourceAddress,
  useResourceAddressOverlay,
} from "#ui/resources/ResourceAddress"
import { presetAddresses } from "#ui/resources/ResourceAddress/ResourceAddress.mocks"
import {
  getResourceAddressFormFieldsSchema,
  ResourceAddressFormFields,
} from "#ui/resources/ResourceAddress/ResourceAddressFormFields"

type Props = Parameters<typeof ResourceAddress>[0] & {
  preset: Array<keyof typeof presetAddresses | "custom">
}

const setup: Meta<Props> = {
  title: "Resources/ResourceAddress",
  component: ResourceAddress,
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

const Template: StoryFn<Props> = ({ preset, ...args }) => {
  return <ResourceAddress {...args} />
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  address: presetAddresses.withName,
}

export const WithoutTitle = Template.bind({})
WithoutTitle.args = {
  isLoading: false,
  address: presetAddresses.withName,
}

export const WithTitle = Template.bind({})
WithTitle.args = {
  isLoading: false,
  title: "Shipping address",
  address: presetAddresses.withName,
}

export const Editable = Template.bind({})
Editable.args = {
  isLoading: false,
  editable: true,
  address: presetAddresses.withNotes,
}

export const NoAddress: StoryFn = () => {
  return (
    <Stack>
      <ResourceAddress
        title="Billing address"
        editable
        showBillingInfo
        requiresBillingInfo
        onCreate={(address) => {
          console.log("new billing address", address)
        }}
      />
      <ResourceAddress
        title="Shipping address"
        editable
        address={null}
        onCreate={(address) => {
          console.log("new shipping address", address)
        }}
      />
    </Stack>
  )
}

export const StackedAddresses: StoryFn = () => {
  return (
    <Stack>
      <ResourceAddress
        address={presetAddresses.withCompany}
        title="Billing address"
        editable
      />
      <ResourceAddress
        address={presetAddresses.withNotes}
        title="Shipping address"
        editable
      />
    </Stack>
  )
}

export const ListedAddresses: StoryFn = () => {
  return (
    <>
      <ListItem>
        <ResourceAddress address={presetAddresses.withCompany} editable />
      </ListItem>
      <ListItem>
        <ResourceAddress address={presetAddresses.withName} editable />
      </ListItem>
    </>
  )
}

export const ApiError: StoryFn = () => {
  return (
    <Stack>
      <ResourceAddress
        address={presetAddresses.withErrors}
        title="Billing address"
        editable
      />
    </Stack>
  )
}

export const UseResourceAddressOverlay: StoryFn = () => {
  const [address, setAddress] = useState(presetAddresses.withName)

  const { ResourceAddressOverlay, openAddressOverlay } =
    useResourceAddressOverlay({
      address,
      title: address.full_name,
      onUpdate: (updatedAddress) => {
        console.log(updatedAddress)
        // @ts-expect-error We don't have the sdk types here
        setAddress(updatedAddress)
      },
    })

  return (
    <>
      <ResourceAddressOverlay />
      <Button
        onClick={() => {
          openAddressOverlay()
        }}
      >
        Edit address
      </Button>
    </>
  )
}

export const ReuseTheAddressForm: StoryFn = () => {
  const methods = useForm({
    defaultValues: {
      name: "John Doe Inc.",
      address: {
        first_name: "John",
        country_code: "IT",
      },
    },
    resolver: zodResolver(
      z.object({
        name: z
          .string({
            required_error: "Required field",
            invalid_type_error: "Invalid format",
          })
          .min(1, {
            message: "Required field",
          }),
        address: getResourceAddressFormFieldsSchema(),
      }),
    ),
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(formValues): void => {
        console.log(formValues)
      }}
    >
      <Spacer bottom="8">
        <HookedInput name="name" label="Name" />
      </Spacer>
      <ResourceAddressFormFields name="address" />
      <Spacer top="14">
        <Button type="submit" className="w-full">
          Create merchant
        </Button>
      </Spacer>
    </HookedForm>
  )
}

export const ShowNameOrCompany: StoryFn = () => {
  const defaultBusiness = true

  const methods = useForm({
    defaultValues: {
      name: "John Doe Inc.",
      address: {
        business: defaultBusiness,
        country_code: "IT",
      },
    },
    resolver: zodResolver(
      z.object({
        name: z
          .string({
            required_error: "Required field",
            invalid_type_error: "Invalid format",
          })
          .min(1, {
            message: "Required field",
          }),
        address: getResourceAddressFormFieldsSchema(),
      }),
    ),
  })

  return (
    <Section
      title="Address"
      actionButton={
        <div style={{ display: "inline-block" }}>
          <InputCheckbox
            defaultChecked={defaultBusiness}
            onChange={(event) => {
              methods.setValue("address.business", event.currentTarget.checked)
            }}
          >
            Business
          </InputCheckbox>
        </div>
      }
    >
      <Spacer top="6">
        <HookedForm
          {...methods}
          onSubmit={(formValues): void => {
            console.log(formValues)
          }}
        >
          <Spacer bottom="8">
            <HookedInput name="name" label="Name" />
          </Spacer>
          <ResourceAddressFormFields name="address" showNameOrCompany />
          <Spacer top="14">
            <Button type="submit" className="w-full">
              Create merchant
            </Button>
          </Spacer>
        </HookedForm>
      </Spacer>
    </Section>
  )
}

import type { Meta, StoryFn } from "@storybook/react-vite"
import { useEffect, useState } from "react"
import { CoreSdkProvider, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Section } from "#ui/atoms/Section"
import { Spacer } from "#ui/atoms/Spacer"
import { ListDetailsItem } from "#ui/composite/ListDetailsItem"
import { PageLayout } from "#ui/composite/PageLayout"
import { ResourceDetails } from "#ui/resources/ResourceDetails"
import { ResourceMetadata } from "#ui/resources/ResourceMetadata"
import { ResourceTags } from "#ui/resources/ResourceTags"

const setup: Meta<typeof ResourceDetails> = {
  title: "Resources/ResourceDetails",
  component: ResourceDetails,
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

type Customer = Awaited<
  ReturnType<
    Awaited<
      ReturnType<typeof useCoreSdkProvider>["sdkClient"]
    >["customers"]["retrieve"]
  >
>

export const ResourceDetailsDefault: StoryFn = () => {
  const { sdkClient } = useCoreSdkProvider()
  const [customer, setSetCustomer] = useState<Customer>()

  useEffect(() => {
    void sdkClient.customers.retrieve("NMWYhbGorj").then((customer) => {
      setSetCustomer(customer)
    })
  }, [sdkClient])

  if (customer == null) return <div>Loading...</div>

  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <ResourceDetails
          resource={customer}
          onUpdated={async () => {
            console.log("updated")
          }}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * In `PageLayout`'s sidebar the blocks adapt on their own: from `lg` up the column is
 * a card, the rows stay stacked and lose their dividers, and the section titles
 * shrink. Narrow the viewport and it goes back to the page rendering, since every
 * difference is behind `lg:`.
 *
 * The order is the one the detail pages use — tags, metadata, then details, whose id
 * and timestamps are the least useful of the three. The column's top offset comes
 * from the layout, so the slot itself starts right at the card's padding.
 */
export const InTheSidebar: StoryFn = () => {
  const { sdkClient } = useCoreSdkProvider()
  const [customer, setSetCustomer] = useState<Customer>()

  useEffect(() => {
    void sdkClient.customers.retrieve("NMWYhbGorj").then((retrieved) => {
      setSetCustomer(retrieved)
    })
  }, [sdkClient])

  if (customer == null) return <div>Loading...</div>

  return (
    <PageLayout
      title="Customer"
      sidebar={
        <>
          <ResourceTags
            resourceType="customers"
            resourceId={customer.id}
            overlay={{ title: "customer@tk.com" }}
          />
          <Spacer top="10">
            <ResourceMetadata
              resourceType="customers"
              resourceId={customer.id}
              overlay={{ title: "customer@tk.com" }}
            />
          </Spacer>
          <Spacer top="10">
            <ResourceDetails
              resource={customer}
              onUpdated={async () => {
                console.log("updated")
              }}
            />
          </Spacer>
        </>
      }
    >
      <Spacer top="14">
        <Section title="Main content">
          <ListDetailsItem label="Something">
            in the main column
          </ListDetailsItem>
        </Section>
      </Spacer>
    </PageLayout>
  )
}

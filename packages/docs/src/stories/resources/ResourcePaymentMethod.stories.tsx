import type { Meta, StoryFn } from "@storybook/react-vite"
import { Icon } from "#ui/atoms/Icon"
import {
  getPaymentInstrumentDetails,
  ResourcePaymentMethod,
} from "#ui/resources/ResourcePaymentMethod"
import {
  customerPaymentSource,
  orderWithoutPaymentSourceResponse,
  orderWithPaymentSourceResponse,
} from "#ui/resources/ResourcePaymentMethod.mocks"

const setup: Meta<typeof ResourcePaymentMethod> = {
  title: "Resources/ResourcePaymentMethod",
  component: ResourcePaymentMethod,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem 2rem" }}>
        <Story />
      </div>
    ),
  ],
}
export default setup

const Template: StoryFn<typeof ResourcePaymentMethod> = (args) => (
  <ResourcePaymentMethod {...args} />
)

export const Default = Template.bind({})
Default.args = {
  resource: orderWithoutPaymentSourceResponse,
}

/**
 * The component can show more details on the transaction (`payment_source.payment_response`) by enabling `showPaymentResponse` prop.
 * If the `payment_response` is not available, the show more button will not be present.
 */
export const WithOrder = Template.bind({})
WithOrder.args = {
  resource: orderWithPaymentSourceResponse,
  showPaymentResponse: true,
}

/**
 * When working in a customer context, we can pass the `customer_payment_source` to render the block related to the saved payment source.
 */
export const WithCustomerPaymentSource = Template.bind({})
WithCustomerPaymentSource.args = {
  resource: customerPaymentSource,
}

/**
 * When used in lists or other components, boxed style can be removed using `variant: plain`.
 */
export const WithoutSideGap = Template.bind({})
WithoutSideGap.args = {
  resource: customerPaymentSource,
  variant: "plain",
}

/**
 * The component can show a custom action button on the right side of the row.
 * This can be used to remove a payment source or other actions.
 */
export const WithActionButton = Template.bind({})
WithActionButton.args = {
  resource: customerPaymentSource,
  actionButton: (
    <button
      type="button"
      onClick={() => {
        alert("Remove!")
      }}
    >
      <Icon name="trash" size={18} />
    </button>
  ),
}

/**
 * `getPaymentInstrumentDetails` is a standalone helper that extracts payment data
 * from an `Order` or `CustomerPaymentSource` resource as plain strings, without
 * rendering any UI. Useful when you need those values independently.
 */
export const HelperGetPaymentInstrumentDetails: StoryFn = () => {
  const examples = [
    { label: "Order", resource: orderWithPaymentSourceResponse },
    { label: "CustomerPaymentSource", resource: customerPaymentSource },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {examples.map(({ label, resource }) => {
        const details = getPaymentInstrumentDetails(resource)
        return (
          <div key={label}>
            <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              {label}
            </p>
            <pre style={{ margin: 0 }}>{JSON.stringify(details, null, 2)}</pre>
          </div>
        )
      })}
    </div>
  )
}
HelperGetPaymentInstrumentDetails.storyName =
  "Helper: getPaymentInstrumentDetails"

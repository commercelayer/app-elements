import { fireEvent, render } from "@testing-library/react"
import {
  getPaymentInstrumentDetails,
  ResourcePaymentMethod,
} from "./ResourcePaymentMethod"
import {
  customerPaymentSource,
  orderWithoutPaymentSourceResponse,
  orderWithPaymentSourceResponse,
} from "./ResourcePaymentMethod.mocks"

describe("ResourcePaymentMethod", () => {
  it("should render the component", () => {
    const { getByText } = render(
      <ResourcePaymentMethod resource={orderWithoutPaymentSourceResponse} />,
    )
    expect(getByText("Adyen Payment")).toBeVisible()
  })

  it("should not show expandable content if payment_source is available but `showPaymentResponse` is falsy", async () => {
    const { getByText, queryByText } = render(
      <ResourcePaymentMethod resource={orderWithPaymentSourceResponse} />,
    )
    expect(getByText("Adyen Payment")).toBeVisible()
    expect(getByText("Amex credit card")).toBeVisible()
    expect(getByText("··4242")).toBeVisible()

    // expandable content is not enabled
    expect(queryByText("common.show_more")).not.toBeInTheDocument()
    expect(queryByText("common.show_less")).not.toBeInTheDocument()
  })

  it("should show the expandable content (payment_source) when `showPaymentResponse` is set", async () => {
    const { getByText, queryByText } = render(
      <ResourcePaymentMethod
        resource={orderWithPaymentSourceResponse}
        showPaymentResponse
      />,
    )
    expect(getByText("Adyen Payment")).toBeVisible()
    expect(getByText("Amex credit card")).toBeVisible()
    expect(getByText("··4242")).toBeVisible()

    // expandable content is enabled
    expect(getByText("common.show_more")).toBeVisible()

    // show payment response block
    fireEvent.click(getByText("common.show_more"))
    expect(getByText("common.show_less")).toBeVisible()
    expect(getByText("resultCode:")).toBeVisible()
    expect(getByText("fraudResult:")).toBeVisible()

    // hide payment response block
    fireEvent.click(getByText("common.show_less"))
    expect(queryByText("common.show_more")).toBeVisible()
    expect(queryByText("common.show_less")).not.toBeInTheDocument()
    expect(queryByText("resultCode:")).not.toBeInTheDocument()
    expect(queryByText("fraudResult:")).not.toBeInTheDocument()
  })

  it("should render card details from a CustomerPaymentSource", () => {
    const { getByText } = render(
      <ResourcePaymentMethod resource={customerPaymentSource} />,
    )
    expect(getByText("Braintree")).toBeVisible()
    expect(getByText("··0004")).toBeVisible()
    expect(getByText(/10\/30/)).toBeVisible()
  })
})

describe("getPaymentInstrumentDetails", () => {
  it("should return only paymentMethodName when no payment_instrument is present", () => {
    const result = getPaymentInstrumentDetails(
      orderWithoutPaymentSourceResponse,
    )
    expect(result.paymentMethodName).toBe("Adyen Payment")
    expect(result.cardType).toBeUndefined()
    expect(result.issuerType).toBeUndefined()
    expect(result.cardLastDigits).toBeUndefined()
    expect(result.cardExpiry).toBeUndefined()
  })

  it("should return card details without expiry when expiry fields are missing", () => {
    const result = getPaymentInstrumentDetails(orderWithPaymentSourceResponse)
    expect(result.paymentMethodName).toBe("Adyen Payment")
    expect(result.cardType).toBe("Amex")
    expect(result.issuerType).toBe("credit card")
    expect(result.cardLastDigits).toBe("··4242")
    expect(result.cardExpiry).toBeUndefined()
  })

  it("should return title-cased card type, formatted expiry, and name from CustomerPaymentSource", () => {
    const result = getPaymentInstrumentDetails(customerPaymentSource)
    expect(result.paymentMethodName).toBe("Braintree")
    expect(result.cardType).toBe("Visa")
    expect(result.issuerType).toBe("braintree")
    expect(result.cardLastDigits).toBe("··0004")
    expect(result.cardExpiry).toBe("10/30")
  })
})

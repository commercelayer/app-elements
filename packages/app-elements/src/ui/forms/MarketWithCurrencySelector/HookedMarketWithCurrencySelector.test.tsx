import { render, waitFor } from "@testing-library/react"
import type { FC, ReactNode } from "react"
import { useForm } from "react-hook-form"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { HookedForm } from "#ui/forms/Form"
import { HookedMarketWithCurrencySelector } from "./HookedMarketWithCurrencySelector"

const HookedFormWrapper: FC<{
  children: ReactNode
  defaultValues: Record<string, string>
}> = ({ children, defaultValues }) => {
  const methods = useForm({
    defaultValues,
  })
  return (
    <TokenProvider kind="integration" appSlug="orders" devMode>
      <CoreSdkProvider>
        <HookedForm
          {...methods}
          onSubmit={(values) => {
            alert(JSON.stringify(values))
          }}
        >
          {children}
        </HookedForm>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

describe("HookedMarketWithCurrencySelector", () => {
  test("renders with default values and both inputs visible", async () => {
    const { getByText } = render(
      <HookedFormWrapper
        defaultValues={{
          market: "",
          currency_code: "EUR",
        }}
      >
        <HookedMarketWithCurrencySelector
          fieldNameMarket="market"
          fieldNameCurrencyCode="currency_code"
          label="Market *"
        />
      </HookedFormWrapper>,
    )
    const label = getByText("Market *")
    // const initialMarketOption = getByText('All markets with currency')
    const initialCurrencyOption = getByText("EUR")

    expect(label).toBeVisible()
    // expect(initialMarketOption).toBeVisible()
    expect(initialCurrencyOption).toBeVisible()
  })

  test("renders the component with an existing market", async () => {
    const { getByText, queryByText } = render(
      <HookedFormWrapper
        defaultValues={{
          market: "USA",
          currency_code: "USD",
        }}
      >
        <HookedMarketWithCurrencySelector
          fieldNameMarket="market"
          fieldNameCurrencyCode="currency_code"
          label="Market *"
        />
      </HookedFormWrapper>,
    )

    await waitFor(() => {
      // Market fetched from the API should be visible
      expect(getByText("USA")).toBeVisible()
    })
    // initial empty option should not be visible
    expect(queryByText("All markets with currency")).toBeNull()

    // Currency input should not be visible when a market is selected
    expect(queryByText("EUR")).toBeNull()
    expect(queryByText("USD")).toBeNull()
  })
})

import { fireEvent, render, waitFor } from "@testing-library/react"
import type { FC, ReactNode } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { HookedForm } from "#ui/forms/Form"
import { FieldGroupedPredicates } from "./FieldGroupedPredicates"
import type { FilterItemGroupedPredicates } from "./types"

const FormWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const methods = useForm()
  return (
    <HookedForm {...methods} onSubmit={() => {}}>
      {children}
    </HookedForm>
  )
}

const FormValue: FC<{ name: string }> = ({ name }) => {
  const { watch } = useFormContext()
  return <output data-testid="form-value">{JSON.stringify(watch(name))}</output>
}

const options: FilterItemGroupedPredicates["render"]["props"]["options"] = [
  {
    label: "In stock",
    value: "in_stock",
    sdk: { predicate: "quantity_gt", value: "0" },
  },
  {
    label: "Low stock",
    value: "low_stock",
    sdk: [
      { predicate: "low_stock", value: "true" },
      { predicate: "quantity_gt", value: "0" },
    ],
  },
  {
    label: "Discontinued",
    value: "discontinued",
    isHidden: true,
    sdk: { predicate: "discontinued", value: "true" },
  },
]

describe("FieldGroupedPredicates", () => {
  test("renders toggle buttons by default", () => {
    const { getByText, queryByText } = render(
      <FormWrapper>
        <FieldGroupedPredicates
          item={{
            label: "Availability",
            type: "groupedPredicates",
            urlParamKey: "availability",
            render: {
              component: "inputToggleButton",
              props: { mode: "single", options },
            },
          }}
        />
      </FormWrapper>,
    )

    expect(getByText("Availability")).toBeVisible()
    expect(getByText("In stock")).toBeVisible()
    expect(getByText("Low stock")).toBeVisible()
    expect(queryByText("Discontinued")).toBeNull()
  })

  test("renders a select storing the picked option value", async () => {
    const { getByText, queryByText, getByTestId } = render(
      <FormWrapper>
        <FieldGroupedPredicates
          item={{
            label: "Availability",
            type: "groupedPredicates",
            urlParamKey: "availability",
            render: {
              component: "inputSelect",
              props: { mode: "single", placeholder: "Any", options },
            },
          }}
        />
        <FormValue name="availability" />
      </FormWrapper>,
    )

    expect(getByText("Availability")).toBeVisible()
    expect(getByText("Any")).toBeVisible()
    expect(queryByText("Low stock")).toBeNull()

    fireEvent.keyDown(getByText("Any"), { key: "ArrowDown" })
    await waitFor(() => {
      expect(getByText("Low stock")).toBeVisible()
    })
    // hidden options stay valid in the query, they are just not offered
    expect(queryByText("Discontinued")).toBeNull()

    fireEvent.click(getByText("Low stock"))
    expect(getByTestId("form-value")).toHaveTextContent('"low_stock"')
  })
})

import { fireEvent, render } from "@testing-library/react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Text } from "#ui/atoms/Text"
import { HookedInputCheckboxGroup } from "./HookedInputCheckboxGroup"

interface FormValues {
  items: Array<{
    value: string
    quantity?: number
    reason?: string
  }>
}

const options = [
  {
    value: "BABYBIBXA19D9D000000XXXX",
    content: (
      <Text size="small" tag="div" weight="bold">
        Gray Baby Bib with Black Logo
      </Text>
    ),
    quantity: {
      min: 1,
      max: 5,
    },
  },
  {
    value: "BASEBHAT000000FFFFFFXXXX",
    content: (
      <Text size="small" tag="div" weight="bold">
        Black Baseball Hat with White Logo
      </Text>
    ),
    quantity: {
      min: 1,
      max: 7,
    },
  },
]

function SetReasonButton(): React.JSX.Element {
  const { setValue } = useFormContext<FormValues>()

  return (
    <button
      type="button"
      onClick={() => {
        setValue("items.0.reason", "Damaged")
      }}
    >
      Set reason
    </button>
  )
}

function ValuesPreview(): React.JSX.Element {
  const { watch } = useFormContext<FormValues>()

  return <pre data-testid="values">{JSON.stringify(watch("items"))}</pre>
}

function TestComponent(): React.JSX.Element {
  const methods = useForm<FormValues>({
    defaultValues: {
      items: [
        {
          value: "BABYBIBXA19D9D000000XXXX",
          quantity: 2,
        },
        {
          value: "BASEBHAT000000FFFFFFXXXX",
          quantity: 3,
        },
      ],
    },
  })

  return (
    <FormProvider {...methods}>
      <SetReasonButton />
      <ValuesPreview />
      <HookedInputCheckboxGroup name="items" title="Items" options={options} />
    </FormProvider>
  )
}

describe("HookedInputCheckboxGroup", () => {
  test("preserves extra item fields after nested setValue and toggle", () => {
    const { getAllByTestId, getByRole, getByTestId } = render(<TestComponent />)

    fireEvent.click(getByRole("button", { name: "Set reason" }))
    expect(getByTestId("values").textContent).toContain('"reason":"Damaged"')

    const [, secondItem] = getAllByTestId("InputCheckboxGroupItem")
    assertToBeDefined(secondItem)

    fireEvent.click(secondItem)

    const values = JSON.parse(getByTestId("values").textContent ?? "null")
    expect(values).toEqual([
      {
        value: "BABYBIBXA19D9D000000XXXX",
        quantity: 2,
        reason: "Damaged",
      },
    ])
  })
})

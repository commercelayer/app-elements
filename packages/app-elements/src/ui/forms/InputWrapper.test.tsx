import {
  fireEvent,
  type RenderResult,
  render,
  screen,
} from "@testing-library/react"
import type { ReactNode } from "react"
import { Input } from "#ui/forms/Input"
import { InputCheckbox } from "#ui/forms/InputCheckbox"
import { InputCurrency } from "#ui/forms/InputCurrency"
import { InputJson } from "#ui/forms/InputJson"
import { InputSimpleSelect } from "#ui/forms/InputSimpleSelect"
import { InputSwitch } from "#ui/forms/InputSwitch"
import { InputTextArea } from "#ui/forms/InputTextArea"
import {
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"

interface SetupProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id }: SetupProps): SetupResult => {
  const utils = render(
    <InputWrapper data-testid={id}>
      <input />
    </InputWrapper>,
  )
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils,
  }
}

const hint: InputWrapperBaseProps["hint"] = { text: "Shown on the invoice" }
const danger: InputWrapperBaseProps["feedback"] = {
  variant: "danger",
  message: "Required field",
}

describe("InputWrapper", () => {
  test("Should be rendered", () => {
    const { element } = setup({
      id: "input-wrapper",
    })
    expect(element).toBeInTheDocument()
    expect(element.querySelector("input")).toBeInTheDocument()
  })

  test("Should describe a fieldset with its feedback and hint", () => {
    render(
      <InputWrapper fieldset label="Shipping" feedback={danger} hint={hint}>
        <input type="radio" name="shipping" />
      </InputWrapper>,
    )
    expect(screen.getByRole("group")).toHaveAccessibleDescription(
      "Required field Shown on the invoice",
    )
  })
})

describe("Inputs built on InputWrapper", () => {
  const cases: Array<{
    name: string
    role: string
    render: (props: InputWrapperBaseProps) => ReactNode
  }> = [
    {
      name: "Input",
      role: "textbox",
      render: (props) => <Input name="code" label="Code" {...props} />,
    },
    {
      name: "InputTextArea",
      role: "textbox",
      render: (props) => <InputTextArea name="code" label="Code" {...props} />,
    },
    {
      name: "InputSimpleSelect",
      role: "combobox",
      render: (props) => (
        <InputSimpleSelect
          name="code"
          label="Code"
          options={[{ value: "a", label: "A" }]}
          {...props}
        />
      ),
    },
    {
      name: "InputSwitch",
      role: "checkbox",
      render: (props) => <InputSwitch name="code" label="Code" {...props} />,
    },
    {
      name: "InputCheckbox",
      role: "checkbox",
      render: (props) => (
        <InputCheckbox name="code" {...props}>
          Code
        </InputCheckbox>
      ),
    },
    {
      name: "InputCurrency",
      role: "textbox",
      render: (props) => (
        <InputCurrency
          name="code"
          label="Code"
          currencyCode="EUR"
          onChange={() => {}}
          {...props}
        />
      ),
    },
  ]

  describe.each(cases)("$name", ({ role, render: renderInput }) => {
    test("Should be named by its label", () => {
      render(renderInput({}))
      expect(screen.getByRole(role, { name: "Code" })).toBeInTheDocument()
    })

    test("Should be described by its feedback and hint, and be invalid on a danger feedback", () => {
      render(renderInput({ feedback: danger, hint }))
      const field = screen.getByRole(role, { name: "Code" })
      expect(field).toHaveAccessibleDescription(
        "Required field Shown on the invoice",
      )
      expect(field).toHaveAttribute("aria-invalid", "true")
    })

    test("Should not be invalid on a warning or success feedback", () => {
      render(
        renderInput({ feedback: { variant: "warning", message: "Check it" } }),
      )
      const field = screen.getByRole(role, { name: "Code" })
      expect(field).toHaveAccessibleDescription("Check it")
      expect(field).not.toHaveAttribute("aria-invalid")
    })
  })
})

describe("InputJson", () => {
  test("Should be named by its label and invalid with its error described", () => {
    render(
      <InputJson
        label="Metadata"
        hint={hint}
        placeholder={{}}
        validateFn={(json) => json}
        onDataReady={() => {}}
        onDataResetRequest={() => {}}
      />,
    )
    const field = screen.getByRole("textbox", { name: "Metadata" })
    expect(field).not.toHaveAttribute("aria-invalid")

    fireEvent.change(field, { target: { value: "{ not json" } })
    expect(field).toHaveAttribute("aria-invalid", "true")
    expect(field).toHaveAccessibleDescription(
      "Invalid JSON Shown on the invoice",
    )
  })
})

describe("useInputWrapperField", () => {
  test("Should give two fields with the same name their own id", () => {
    render(
      <>
        <Input name="email" label="Filter by email" />
        <Input name="email" label="Customer email" />
      </>,
    )
    const filter = screen.getByRole("textbox", { name: "Filter by email" })
    const customer = screen.getByRole("textbox", { name: "Customer email" })
    expect(filter.id).not.toBe(customer.id)
    expect(filter.id).toMatch(/^email-/)
  })

  test("Should keep the id that is passed", () => {
    render(<Input id="customer-email" name="email" label="Email" />)
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "id",
      "customer-email",
    )
  })

  test("Should mark a required field", () => {
    render(<Input name="email" label="Email" required />)
    const field = screen.getByRole("textbox", { name: "Email" })
    expect(field).toBeRequired()
    expect(field).toHaveAttribute("aria-required", "true")
  })

  test("Should keep the aria-describedby that is passed", () => {
    render(
      <>
        <p id="email-help">We never share it</p>
        <Input
          name="email"
          label="Email"
          hint={hint}
          aria-describedby="email-help"
        />
      </>,
    )
    expect(
      screen.getByRole("textbox", { name: "Email" }),
    ).toHaveAccessibleDescription("We never share it Shown on the invoice")
  })
})

import { fireEvent, render, waitFor } from "@testing-library/react"
import { InputSelect } from "./InputSelect"

describe("InputSelect", () => {
  test("should render", () => {
    const { container, getByText } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        placeholder="Please select an option"
      />,
    )
    expect(container).toBeVisible()
    expect(getByText("Please select an option")).toBeVisible()
  })

  test("should render default value", () => {
    const { container, queryByText } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[
          {
            value: "paris",
            label: "Paris",
          },
          {
            value: "london",
            label: "London",
          },
        ]}
        defaultValue={{
          value: "paris",
          label: "Paris",
        }}
      />,
    )
    expect(container).toBeVisible()
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeNull()
  })

  test("should select a value", async () => {
    const mockedOnSelect = vi.fn()
    const { container, queryByText, getByText } = render(
      <InputSelect
        onSelect={mockedOnSelect}
        initialValues={[
          {
            value: "paris",
            label: "Paris",
          },
          {
            value: "london",
            label: "London",
          },
        ]}
        placeholder="Please select an option"
      />,
    )
    expect(container).toBeVisible()
    expect(queryByText("Please select an option")).toBeVisible()
    expect(queryByText("London")).toBeNull()

    // open select dropdown
    fireEvent.keyDown(getByText("Please select an option"), {
      key: "ArrowDown",
    })
    await waitFor(() => queryByText("London"))
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeVisible()
    fireEvent.click(getByText("London"))
    expect(mockedOnSelect).toHaveBeenCalledTimes(1)

    expect(queryByText("Please select an option")).toBeNull()
    expect(queryByText("Paris")).toBeNull()
    expect(queryByText("London")).toBeVisible()
  })

  test("should not select the value when the option is disabled", async () => {
    const mockedOnSelect = vi.fn()
    const { container, queryByText, getByText } = render(
      <InputSelect
        onSelect={mockedOnSelect}
        initialValues={[
          {
            value: "paris",
            label: "Paris",
          },
          {
            value: "london",
            label: "London",
            isDisabled: true,
          },
        ]}
        placeholder="Please select an option"
      />,
    )
    expect(container).toBeVisible()
    expect(queryByText("Please select an option")).toBeVisible()
    expect(queryByText("London")).toBeNull()

    // open select dropdown
    fireEvent.keyDown(getByText("Please select an option"), {
      key: "ArrowDown",
    })
    await waitFor(() => queryByText("London"))
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeVisible()
    fireEvent.click(getByText("London"))
    expect(mockedOnSelect).not.toHaveBeenCalledTimes(1)

    expect(queryByText("Please select an option")).toBeVisible()
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeVisible()
  })

  test("renders the chevron on an async select", async () => {
    const { container } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        loadAsyncValues={async () => []}
      />,
    )
    await waitFor(() => {
      expect(
        container.querySelector('[class*="indicatorContainer"] svg'),
      ).toBeInTheDocument()
    })
  })

  // for a field that is a text entry first and a picker second, e.g. an email that
  // may not exist yet
  test("hides the chevron when asked", async () => {
    const { container } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        loadAsyncValues={async () => []}
        hideDropdownIndicator
      />,
    )
    await waitFor(() => {
      expect(container.querySelector("input")).toBeInTheDocument()
    })
    expect(
      container.querySelector('[class*="indicatorContainer"] svg'),
    ).not.toBeInTheDocument()
  })
})

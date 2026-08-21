import { act, fireEvent, render, waitFor } from "@testing-library/react"
import {
  PageHeadingToolbar,
  type PageHeadingToolbarProps,
} from "./PageHeadingToolbar"

const buttons = [
  {
    label: "Primary",
    size: "small",
    onClick: () => {
      console.log("Primary")
    },
  },
  {
    label: "Secondary",
    icon: "pulse",
    variant: "secondary",
    size: "small",
    onClick: () => {
      console.log("Secondary")
    },
  },
] satisfies PageHeadingToolbarProps["buttons"]

const dropdownItems = [
  [
    {
      label: "Edit",
      onClick: () => {
        console.log("Edit")
      },
    },
    {
      label: "Set metadata",
      onClick: () => {
        console.log("Set metadata")
      },
    },
  ],
  [
    {
      label: "Delete",
      onClick: () => {
        console.log("Delete")
      },
    },
  ],
] satisfies PageHeadingToolbarProps["dropdownItems"]

describe("PageHeadingToolbar", () => {
  it("Should not be rendered", () => {
    const { queryByTestId } = render(<PageHeadingToolbar />)
    expect(queryByTestId("toolbar")).not.toBeInTheDocument()
  })

  it("Should render items", async () => {
    const { queryAllByTestId, queryByTestId, getByText } = render(
      <PageHeadingToolbar buttons={buttons} dropdownItems={dropdownItems} />,
    )

    expect(queryAllByTestId("toolbar-button").length).toEqual(2)
    expect(queryAllByTestId("toolbar-dropdown-button").length).toEqual(1)
    expect(queryByTestId("toolbar-dropdown-button")).not.toHaveClass(
      "md:hidden",
    )
    const dropDownButton = queryByTestId("toolbar-dropdown-button")
    if (dropDownButton != null) {
      act(() => {
        fireEvent.click(dropDownButton)
      })
      await waitFor(() => {
        expect(getByText("Edit")).toBeInTheDocument()
        expect(getByText("Set metadata")).toBeInTheDocument()
        expect(getByText("Delete")).toBeInTheDocument()
      })
    }
  })

  it("Should hide the secondary button and the dropdown through media queries only", () => {
    const { queryAllByTestId, queryByTestId } = render(
      <PageHeadingToolbar buttons={buttons} />,
    )

    // A `Button` always carries `inline-flex`, declared after `hidden` in the
    // stylesheet: a base `hidden` would lose to it and both the button and the
    // dropdown holding the same action would show up together on small screens.
    const [, secondary] = queryAllByTestId("toolbar-button")
    expect(secondary).toHaveClass("max-md:hidden")
    expect(secondary).not.toHaveClass("hidden")

    const dropdown = queryByTestId("toolbar-dropdown-button")
    expect(dropdown).toHaveClass("md:hidden")
    expect(dropdown).not.toHaveClass("flex")
  })

  it("Should keep a single button as a button, with no dropdown beside it", () => {
    // the secondary one alone: the variant that used to be collapsed
    const { queryAllByTestId, queryByTestId, getByText } = render(
      <PageHeadingToolbar buttons={buttons.slice(1)} />,
    )

    expect(queryAllByTestId("toolbar-button").length).toEqual(1)
    // not hidden at any size, and not duplicated as a dropdown item
    expect(getByText("Secondary").closest("button")).not.toHaveClass(
      "max-md:hidden",
    )
    expect(queryByTestId("toolbar-dropdown-button")).not.toBeInTheDocument()
  })

  it("Should not display the dropdown button when empty", async () => {
    const { queryAllByTestId } = render(
      <PageHeadingToolbar
        buttons={[
          {
            label: "Primary",
            size: "small",
            onClick: () => {
              console.log("Primary")
            },
          },
        ]}
        dropdownItems={[[]]}
      />,
    )

    expect(queryAllByTestId("toolbar-button").length).toEqual(1)
    expect(queryAllByTestId("toolbar-dropdown-button").length).toEqual(0)
  })
})

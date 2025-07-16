import { act, fireEvent, render, waitFor } from "@testing-library/react"
import { Toolbar, type ToolbarProps } from "./Toolbar"

const items = [
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
  {
    icon: "dotsThree",
    size: "small",
    variant: "secondary",
    dropdownItems: [
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
    ],
  },
] satisfies ToolbarProps["items"]

describe("Toolbar", () => {
  it("Should not be rendered", () => {
    const { queryByTestId } = render(<Toolbar items={[]} />)
    expect(queryByTestId("toolbar")).not.toBeInTheDocument()
  })

  it("Should render items", async () => {
    const { queryAllByTestId, queryByTestId, getByText } = render(
      <Toolbar items={items} />,
    )

    expect(queryAllByTestId("toolbar-button").length).toEqual(2)
    expect(queryAllByTestId("toolbar-dropdown-button").length).toEqual(1)
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
})

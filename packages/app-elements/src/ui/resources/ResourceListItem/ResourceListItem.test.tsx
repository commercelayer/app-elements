import { render } from "@testing-library/react"
import { MockTokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { ResourceListItem, type ResourceListItemProps } from "./index"
import { presetResourceListItem } from "./ResourceListItem.mocks"

const setup = (props: Omit<ResourceListItemProps, "resource">) =>
  render(
    <MockTokenProvider kind="integration" appSlug="orders" devMode>
      <ResourceListItem
        resource={presetResourceListItem.orderAwaitingApproval}
        {...props}
      />
    </MockTokenProvider>,
  )

describe("ResourceListItem", () => {
  test("should not show the caret of a row that is not clickable", async () => {
    const { findByTestId, queryByTestId } = setup({})
    expect(await findByTestId("ResourceListItem")).toBeInTheDocument()
    expect(queryByTestId("ResourceListItem-caret")).toBeNull()
  })

  test("should show the caret after the right content of a clickable row", async () => {
    const { findByTestId } = setup({ href: "#" })
    const caret = await findByTestId("ResourceListItem-caret")
    // the order total is the right content, and the caret follows it
    expect(caret.previousElementSibling?.textContent).toContain("$")
  })

  test("should show the caret after a `rightContentOverride`", async () => {
    const { findByTestId } = setup({
      onClick: () => {},
      rightContentOverride: <span>override</span>,
    })
    const caret = await findByTestId("ResourceListItem-caret")
    expect(caret.previousElementSibling?.textContent).toContain("override")
  })

  test("should not show the caret of a clickable row with `actions`", async () => {
    const { findByTestId, queryByTestId } = setup({
      href: "#",
      actions: <button type="button">menu</button>,
    })
    expect(await findByTestId("ResourceListItem")).toBeInTheDocument()
    expect(queryByTestId("ResourceListItem-caret")).toBeNull()
  })
})

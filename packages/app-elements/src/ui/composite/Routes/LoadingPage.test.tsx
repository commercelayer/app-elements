import { render } from "@testing-library/react"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { LoadingPage } from "./Routes"

const setup = (overlay: boolean): HTMLElement => {
  const { getByTestId } = render(
    <TokenProvider kind="integration" appSlug="orders" devMode>
      <LoadingPage overlay={overlay} />
    </TokenProvider>,
  )
  return getByTestId("page-loading")
}

describe("LoadingPage", () => {
  test("Should fill the screen while an overlay route loads", () => {
    // the route resolves into a fixed, full-screen surface, so the placeholder has
    // to be one too — in the page flow it read as a grey band among the content
    // behind it, and the page jumped once the real overlay took over
    const surface = setup(true).closest("div.fixed")
    expect(surface).not.toBeNull()
    expect(surface).toHaveClass("inset-0", "bg-gray-50")
  })

  test("Should sit in the page flow for a regular route", () => {
    expect(setup(false).closest("div.fixed")).toBeNull()
  })
})

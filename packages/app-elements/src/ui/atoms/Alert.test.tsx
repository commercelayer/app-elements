import { render } from "@testing-library/react"
import { Alert } from "./Alert"

describe("Alert", () => {
  test("Should be rendered", () => {
    const { getByRole } = render(
      <Alert status="warning">Ehi, this is a warning!</Alert>,
    )

    const alert = getByRole("alert")
    expect(alert).toBeVisible()
    expect(alert.textContent).toBe("Ehi, this is a warning!")
    expect(alert.querySelector("svg")).toBeVisible()
  })
})

import { render } from "@testing-library/react"
import { Modal } from "#ui/composite/Modal"
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

  test("Should infer the modal surface when rendered inside a Modal", () => {
    const { getByRole } = render(
      <Modal show onClose={() => {}}>
        <Modal.Body>
          <Alert status="info">Inside a modal</Alert>
        </Modal.Body>
      </Modal>,
    )

    const alert = getByRole("alert")
    expect(alert).toHaveClass("rounded")
    expect(alert).not.toHaveClass("md:rounded-md")
  })

  test("Should let the `surface` prop win over the inferred one", () => {
    const { getByRole } = render(
      <Modal show onClose={() => {}}>
        <Modal.Body>
          <Alert status="info" surface="default">
            Inside a modal
          </Alert>
        </Modal.Body>
      </Modal>,
    )

    expect(getByRole("alert")).toHaveClass("md:rounded-md")
  })
})

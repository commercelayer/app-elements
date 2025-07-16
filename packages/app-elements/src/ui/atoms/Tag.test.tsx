import { type RenderResult, render } from "@testing-library/react"
import { Tag } from "./Tag"

interface SetupProps {
  id: string
  text: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, text }: SetupProps): SetupResult => {
  const utils = render(<Tag data-testid={id}>{text}</Tag>)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils,
  }
}

describe("Tag", () => {
  test("Should be rendered", () => {
    const { element } = setup({ id: "some-tag", text: "My tag" })
    expect(element).toBeVisible()
    expect(element.innerHTML).toBe("My tag")
    expect(element.tagName).toBe("DIV")
  })
})

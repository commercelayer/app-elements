import { type RenderResult, render } from "@testing-library/react"
import type { SetRequired } from "type-fest"
import { InputFile } from "./InputFile"

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({
  id,
  label,
  title,
}: SetRequired<Parameters<typeof InputFile>[0], "id">): SetupResult => {
  const utils = render(
    <InputFile data-testid={id} title={title} label={label} />,
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils,
  }
}

describe("InputFile", () => {
  test("Should be rendered", () => {
    const { element, getByText } = setup({
      id: "some-label",
      label: "Upload your avatar",
      title: "Select a jpg file to upload",
    })
    expect(element).toBeInTheDocument()
    expect(getByText("Upload your avatar")).toBeInTheDocument()
    expect(getByText("Select a jpg file to upload")).toBeInTheDocument()
  })

  test("Should render an input type=file", () => {
    const { element } = setup({
      id: "some-label",
      label: "Upload your avatar",
      title: "Select a jpg file to upload",
    })
    expect(element.getAttribute("type")).toBe("file")
  })
})

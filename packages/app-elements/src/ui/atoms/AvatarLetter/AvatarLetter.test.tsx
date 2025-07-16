import { render } from "@testing-library/react"
import { AvatarLetter } from "./AvatarLetter"

describe("AvatarLetter", () => {
  it("when the `text` is composed of more than one word, it will use the initials from the first two words.", () => {
    const { getByText } = render(<AvatarLetter text="Commerce Layer" />)
    expect(getByText("CL")).toBeInTheDocument()
  })

  it("when the `text` is composed of one single word, it will use the first two chars of the text.", () => {
    const { getByText } = render(<AvatarLetter text="Doe" />)
    expect(getByText("DO")).toBeInTheDocument()
  })
})

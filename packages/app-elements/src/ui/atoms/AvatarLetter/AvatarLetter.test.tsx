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

  // the `min-*` classes matter as much as the `w`/`h` ones: without them the
  // circle is squashed when used as a flex child next to text
  it("renders at 42px by default.", () => {
    const { getByText } = render(<AvatarLetter text="Doe" />)
    expect(getByText("DO")).toHaveClass(
      "w-[42px]",
      "h-[42px]",
      "min-w-[42px]",
      "min-h-[42px]",
    )
  })

  it("renders at 36px when `size` is medium.", () => {
    const { getByText } = render(<AvatarLetter text="Doe" size="medium" />)
    expect(getByText("DO")).toHaveClass(
      "w-[36px]",
      "h-[36px]",
      "min-w-[36px]",
      "min-h-[36px]",
    )
  })
})

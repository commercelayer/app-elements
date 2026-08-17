import { render } from "@testing-library/react"
import { Td, Th, Tr } from "#ui/atoms/Table"
import { Table } from "./Table"

const tHead = (
  <Tr>
    <Th>Name</Th>
    <Th>Surname</Th>
  </Tr>
)

const tBody = (
  <>
    <Tr>
      <Td>John</Td>
      <Td>Mayer</Td>
    </Tr>
    <Tr>
      <Td>Eddie</Td>
      <Td>Van Halen</Td>
    </Tr>
    <Tr>
      <Td>Ben</Td>
      <Td>Harper</Td>
    </Tr>
  </>
)

describe("Table", () => {
  it("Should be rendered", () => {
    const { getByRole } = render(<Table thead={tHead} tbody={tBody} />)

    const element = getByRole("table")
    expect(element).toBeInTheDocument()
    expect(element).not.toHaveClass("border")
    expect(element.getElementsByTagName("thead")).toHaveLength(1)
    expect(element.getElementsByTagName("tbody")).toHaveLength(1)
    expect(element.getElementsByTagName("tr")).toHaveLength(4)
    expect(element.getElementsByTagName("th")).toHaveLength(2)
    expect(element.getElementsByTagName("td")).toHaveLength(6)
  })

  it("Should be rendered as boxed variant", () => {
    const { getByRole } = render(
      <Table variant="boxed" thead={tHead} tbody={tBody} />,
    )

    const element = getByRole("table")
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass("border")
  })

  it("Should hide the header on mobile and close the first row with a divider instead", () => {
    const { getByRole, container } = render(
      <Table thead={tHead} tbody={tBody} />,
    )

    expect(container.querySelector("thead")).toHaveClass(
      "hidden",
      "md:table-header-group",
    )
    expect(getByRole("table")).toHaveClass(
      "[&>tbody>tr:first-of-type>td]:border-t",
      "md:[&>tbody>tr:first-of-type>td]:border-t-0",
    )
  })

  // the card border already draws that line
  it("Should not add the mobile divider to a boxed table", () => {
    const { getByRole } = render(
      <Table variant="boxed" thead={tHead} tbody={tBody} />,
    )

    expect(getByRole("table")).not.toHaveClass(
      "[&>tbody>tr:first-of-type>td]:border-t",
    )
  })
})

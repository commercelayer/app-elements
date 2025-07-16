import { render } from "@testing-library/react"
import { Timeline } from "./Timeline"

const events = [
  {
    date: "2022-12-29T23:12:01.200Z",
    message: "M. Jordan placed this order · 23:12",
  },
  {
    date: "2023-01-01T06:28:05.200Z",
    message: "$250,5 authorized on stripe · 6:28",
  },
  {
    date: "2023-01-01T06:28:12.200Z",
    message: "Approved · 6:28 AM",
  },
  {
    date: "2023-01-01T06:29:23.200Z",
    message: "$250,50 captured on stripe · 6:29",
  },
  {
    date: "2023-01-03T06:20:00.200Z",
    message: "Fulfillment in progress · 6:20",
  },
  {
    date: "2023-01-03T08:35:00.200Z",
    message: "S. Jennigs left a note · 8:35",
    note: "Customer would like to receive parcel sooner, please request the customer phone number.",
  },
  {
    date: "2023-01-03T15:23:00.200Z",
    message: "Fullfilled · 15:23",
  },
]

describe("Timeline", () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it("Should be rendered", () => {
    const { getByTestId } = render(<Timeline events={[]} />)
    expect(getByTestId("timeline")).toBeVisible()
  })

  it("Should render events", () => {
    vi.useFakeTimers().setSystemTime("2023-01-03")

    const { getAllByTestId } = render(<Timeline events={events} />)

    const dateGroup = getAllByTestId("timeline-date-group")
    expect(dateGroup.length).toEqual(3)
    expect(dateGroup[0]).toHaveTextContent("TODAY")
    expect(dateGroup[1]).toHaveTextContent("JAN 01")
    expect(dateGroup[2]).toHaveTextContent("DEC 29")

    expect(getAllByTestId("timeline-event-icon").length).toEqual(events.length)
    expect(getAllByTestId("timeline-event-message").length).toEqual(
      events.length,
    )
    expect(getAllByTestId("timeline-event-note").length).toEqual(1)
  })
})

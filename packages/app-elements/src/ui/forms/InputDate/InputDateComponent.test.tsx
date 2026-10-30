import {
  act,
  fireEvent,
  type RenderResult,
  render,
  screen,
} from "@testing-library/react"
import { Modal } from "#ui/composite/Modal"
import { Overlay } from "#ui/internals/Overlay"
import { InputDateComponent, type InputDateProps } from "./InputDateComponent"

interface SetupProps extends InputDateProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<InputDateComponent data-testid={id} {...rest} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils,
  }
}

describe("InputDateComponent", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  test("Should be rendered", () => {
    const { element } = setup({
      id: "date-picker",
      placeholder: "select a date",
      onChange: () => {},
    })
    const input = element.getElementsByTagName("input")[0]
    expect(element).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input?.getAttribute("placeholder")).toBe("select a date")
  })

  test("Should show initial value", () => {
    const { element } = setup({
      id: "date-picker",
      placeholder: "select a date",
      format: "dd-MM-yyyy",
      value: new Date(2022, 11, 19),
      onChange: () => {},
    })
    const input = element.getElementsByTagName("input")[0]
    expect(element).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input?.value).toBe("19-12-2022")
  })

  test("Should update value", () => {
    const date = new Date(2022, 0, 1)
    vi.setSystemTime(date)

    const setDate = vi.fn()

    const { element, getByRole } = setup({
      id: "date-picker",
      placeholder: "select a date",
      format: "dd-MM-yyyy",
      onChange: (date) => {
        setDate(date?.toISOString())
      },
    })

    const [input] = element.getElementsByTagName("input")
    assertToBeDefined(input)

    act(() => {
      fireEvent.click(input)
    })

    act(() => {
      fireEvent.click(
        getByRole("gridcell", { name: "Choose Wednesday, January 5th, 2022" }),
      )
    })

    expect(setDate).toBeCalledTimes(1)
    expect(setDate).toHaveBeenCalledWith("2022-01-05T00:00:00.000Z")
  })

  describe("with a timezone other than the browser's (UTC in tests)", () => {
    const pickDay = (
      element: HTMLElement,
      getByRole: RenderResult["getByRole"],
      name: string,
    ): void => {
      const [input] = element.getElementsByTagName("input")
      assertToBeDefined(input)
      act(() => {
        fireEvent.click(input)
      })
      act(() => {
        fireEvent.click(getByRole("gridcell", { name }))
      })
    }

    test("Should show the value in the timezone", () => {
      const { element } = setup({
        id: "date-picker",
        format: "dd-MM-yyyy HH:mm",
        timezone: "Europe/Rome",
        value: new Date("2022-01-04T23:00:00.000Z"),
        onChange: () => {},
      })
      expect(element.getElementsByTagName("input")[0]?.value).toBe(
        "05-01-2022 00:00",
      )
    })

    test("Should return the midnight of the picked day in the timezone", () => {
      vi.setSystemTime(new Date("2022-01-01T12:00:00.000Z"))
      const onChange = vi.fn()
      const { element, getByRole } = setup({
        id: "date-picker",
        format: "dd-MM-yyyy",
        timezone: "Europe/Rome",
        onChange: (date) => onChange(date?.toISOString()),
      })

      pickDay(element, getByRole, "Choose Wednesday, January 5th, 2022")

      expect(onChange).toHaveBeenCalledWith("2022-01-04T23:00:00.000Z")
    })

    test("Should keep the time in the timezone when the day changes", () => {
      const onChange = vi.fn()
      const { element, getByRole } = setup({
        id: "date-picker",
        format: "dd-MM-yyyy HH:mm",
        timezone: "Europe/Rome",
        // 9:30 in Rome
        value: new Date("2022-01-05T08:30:00.000Z"),
        onChange: (date) => onChange(date?.toISOString()),
      })

      pickDay(element, getByRole, "Choose Monday, January 10th, 2022")

      expect(onChange).toHaveBeenCalledWith("2022-01-10T08:30:00.000Z")
    })

    test("Should fall back to the browser's timezone when the timezone is not valid", () => {
      vi.setSystemTime(new Date("2022-01-01T12:00:00.000Z"))
      const onChange = vi.fn()
      const { element, getByRole } = setup({
        id: "date-picker",
        format: "dd-MM-yyyy",
        timezone: "",
        onChange: (date) => onChange(date?.toISOString()),
      })

      pickDay(element, getByRole, "Choose Wednesday, January 5th, 2022")

      expect(onChange).toHaveBeenCalledWith("2022-01-05T00:00:00.000Z")
    })
  })

  describe("inside a dialog", () => {
    const openCalendar = (): HTMLElement => {
      const [input] = screen
        .getByTestId("date-picker")
        .getElementsByTagName("input")
      assertToBeDefined(input)
      act(() => {
        fireEvent.click(input)
      })
      const popper = document.querySelector<HTMLElement>(
        ".react-datepicker-popper",
      )
      if (popper == null) throw new Error("calendar not open")
      return popper
    }

    const getDialog = (testId: string): HTMLDialogElement => {
      const dialog = screen.getByTestId(testId).closest("dialog")
      if (dialog == null) throw new Error("not inside a dialog")
      return dialog
    }

    test("Should render the calendar in place outside of a dialog", () => {
      setup({ id: "date-picker", onChange: () => {} })

      expect(screen.getByTestId("date-picker")).toContainElement(openCalendar())
    })

    test("Should portal the calendar into a Modal, positioned as fixed", () => {
      render(
        <Modal show onClose={() => {}}>
          <Modal.Body>
            <InputDateComponent data-testid="date-picker" onChange={() => {}} />
          </Modal.Body>
        </Modal>,
      )

      const popper = openCalendar()
      // out of the scrolling body, which would clip it
      expect(screen.getByTestId("modal")).not.toContainElement(popper)
      expect(getDialog("modal")).toContainElement(popper)
      expect(popper.style.position).toBe("fixed")
      // above the modal panel, which sits in the same dialog
      expect(popper).toHaveClass("react-datepicker-popper--in-dialog")
    })

    test("Should portal the calendar into a drawer", () => {
      render(
        <Overlay drawer onBackdropClick={() => {}}>
          <InputDateComponent data-testid="date-picker" onChange={() => {}} />
        </Overlay>,
      )

      const popper = openCalendar()
      expect(screen.getByTestId("overlay")).not.toContainElement(popper)
      expect(getDialog("overlay")).toContainElement(popper)
    })

    test("Should still pick a date from the portalled calendar", () => {
      vi.setSystemTime(new Date(2022, 0, 1))
      const onChange = vi.fn()

      render(
        <Modal show onClose={() => {}}>
          <Modal.Body>
            <InputDateComponent data-testid="date-picker" onChange={onChange} />
          </Modal.Body>
        </Modal>,
      )

      openCalendar()
      act(() => {
        fireEvent.click(
          screen.getByRole("gridcell", {
            name: "Choose Wednesday, January 5th, 2022",
          }),
        )
      })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(document.querySelector(".react-datepicker-popper")).toBeNull()
    })
  })
})

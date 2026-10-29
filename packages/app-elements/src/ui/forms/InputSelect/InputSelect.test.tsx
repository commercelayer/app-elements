import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { Modal } from "#ui/composite/Modal"
import { InputSelect } from "./InputSelect"

describe("InputSelect", () => {
  test("should render", () => {
    const { container, getByText } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        placeholder="Please select an option"
      />,
    )
    expect(container).toBeVisible()
    expect(getByText("Please select an option")).toBeVisible()
  })

  test("should render default value", () => {
    const { container, queryByText } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[
          {
            value: "paris",
            label: "Paris",
          },
          {
            value: "london",
            label: "London",
          },
        ]}
        defaultValue={{
          value: "paris",
          label: "Paris",
        }}
      />,
    )
    expect(container).toBeVisible()
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeNull()
  })

  test("should select a value", async () => {
    const mockedOnSelect = vi.fn()
    const { container, queryByText, getByText } = render(
      <InputSelect
        onSelect={mockedOnSelect}
        initialValues={[
          {
            value: "paris",
            label: "Paris",
          },
          {
            value: "london",
            label: "London",
          },
        ]}
        placeholder="Please select an option"
      />,
    )
    expect(container).toBeVisible()
    expect(queryByText("Please select an option")).toBeVisible()
    expect(queryByText("London")).toBeNull()

    // open select dropdown
    fireEvent.keyDown(getByText("Please select an option"), {
      key: "ArrowDown",
    })
    await waitFor(() => queryByText("London"))
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeVisible()
    fireEvent.click(getByText("London"))
    expect(mockedOnSelect).toHaveBeenCalledTimes(1)

    expect(queryByText("Please select an option")).toBeNull()
    expect(queryByText("Paris")).toBeNull()
    expect(queryByText("London")).toBeVisible()
  })

  test("should not select the value when the option is disabled", async () => {
    const mockedOnSelect = vi.fn()
    const { container, queryByText, getByText } = render(
      <InputSelect
        onSelect={mockedOnSelect}
        initialValues={[
          {
            value: "paris",
            label: "Paris",
          },
          {
            value: "london",
            label: "London",
            isDisabled: true,
          },
        ]}
        placeholder="Please select an option"
      />,
    )
    expect(container).toBeVisible()
    expect(queryByText("Please select an option")).toBeVisible()
    expect(queryByText("London")).toBeNull()

    // open select dropdown
    fireEvent.keyDown(getByText("Please select an option"), {
      key: "ArrowDown",
    })
    await waitFor(() => queryByText("London"))
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeVisible()
    fireEvent.click(getByText("London"))
    expect(mockedOnSelect).not.toHaveBeenCalledTimes(1)

    expect(queryByText("Please select an option")).toBeVisible()
    expect(queryByText("Paris")).toBeVisible()
    expect(queryByText("London")).toBeVisible()
  })

  test("renders the chevron on an async select", async () => {
    const { container } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        loadAsyncValues={async () => []}
      />,
    )
    await waitFor(() => {
      expect(
        container.querySelector('[class*="indicatorContainer"] svg'),
      ).toBeInTheDocument()
    })
  })

  // for a field that is a text entry first and a picker second, e.g. an email that
  // may not exist yet
  test("hides the chevron when asked", async () => {
    const { container } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        loadAsyncValues={async () => []}
        hideDropdownIndicator
      />,
    )
    await waitFor(() => {
      expect(container.querySelector("input")).toBeInTheDocument()
    })
    expect(
      container.querySelector('[class*="indicatorContainer"] svg'),
    ).not.toBeInTheDocument()
  })

  describe("with infinite scroll", () => {
    // jsdom gives every element a zero height, which the library reads as "the
    // menu is already scrolled to its bottom" — so simply opening the menu is
    // what asks for the next page here
    const openMenu = (getByText: (text: string) => HTMLElement): void => {
      fireEvent.keyDown(getByText("Please select an option"), {
        key: "ArrowDown",
      })
    }

    test("loads the following pages as the menu is scrolled", async () => {
      const loadAsyncValues = vi.fn(async (_hint: string, { page }) => ({
        options: [{ value: `page-${page}`, label: `Page ${page}` }],
        hasMore: page < 2,
      }))

      const { getByText, queryByText } = render(
        <InputSelect
          onSelect={() => {}}
          initialValues={[]}
          placeholder="Please select an option"
          infiniteScroll
          loadAsyncValues={loadAsyncValues}
          debounceMs={0}
        />,
      )

      openMenu(getByText)

      await waitFor(() => {
        expect(queryByText("Page 2")).toBeVisible()
      })
      expect(queryByText("Page 1")).toBeVisible()
      expect(loadAsyncValues.mock.calls.map(([, meta]) => meta.page)).toEqual([
        1, 2,
      ])
    })

    // `initialValues` is whatever the caller composed — the labels the closed
    // control needs — and never a claim about which page they are, so taking them
    // for the first page could skip it for good
    test("still starts from the first page when given initial values", async () => {
      const loadAsyncValues = vi.fn(async (_hint: string, { page }) => ({
        options: [{ value: `page-${page}`, label: `Page ${page}` }],
        hasMore: false,
      }))

      const { getByText, queryByText } = render(
        <InputSelect
          onSelect={() => {}}
          initialValues={[{ value: "chosen", label: "Chosen" }]}
          placeholder="Please select an option"
          infiniteScroll
          loadAsyncValues={loadAsyncValues}
          debounceMs={0}
        />,
      )

      openMenu(getByText)

      await waitFor(() => {
        expect(queryByText("Page 1")).toBeVisible()
      })
      expect(loadAsyncValues.mock.calls.map(([, meta]) => meta.page)).toEqual([
        1,
      ])
    })

    // the selected option is fetched on its own so its label resolves, and shows
    // up again once its own page is reached
    test("does not repeat an option already in the menu", async () => {
      const loadAsyncValues = vi.fn(async (_hint: string, { page }) => ({
        options: [{ value: "paris", label: "Paris" }],
        hasMore: page < 2,
      }))

      const { getByText, queryAllByText } = render(
        <InputSelect
          onSelect={() => {}}
          initialValues={[]}
          placeholder="Please select an option"
          infiniteScroll
          loadAsyncValues={loadAsyncValues}
          debounceMs={0}
        />,
      )

      openMenu(getByText)

      await waitFor(() => {
        expect(loadAsyncValues).toHaveBeenCalledTimes(2)
      })
      expect(queryAllByText("Paris")).toHaveLength(1)
    })
  })

  describe("inside a dialog", () => {
    const options = [{ value: "paris", label: "Paris" }]

    const findOption = async (): Promise<HTMLElement> =>
      await waitFor(() => {
        const found = [...document.querySelectorAll<HTMLElement>("*")].find(
          (element) =>
            element.children.length === 0 && element.textContent === "Paris",
        )
        if (found == null) throw new Error("menu not rendered yet")
        return found
      })

    const getDialog = (testId: string): HTMLDialogElement => {
      const dialog = screen.getByTestId(testId).closest("dialog")
      if (dialog == null) throw new Error("not inside a dialog")
      return dialog
    }

    test("should portal the menu into a Modal with no target passed", async () => {
      render(
        <Modal show onClose={() => {}}>
          <Modal.Body>
            <InputSelect
              onSelect={() => {}}
              initialValues={options}
              menuIsOpen
            />
          </Modal.Body>
        </Modal>,
      )

      const option = await findOption()
      // out of the scrolling body, which would clip it
      expect(screen.getByTestId("modal")).not.toContainElement(option)
      expect(getDialog("modal")).toContainElement(option)
    })

    test("should portal into the dialog a menu targeted outside of it", async () => {
      const outside = document.createElement("div")
      document.body.appendChild(outside)

      render(
        <Modal show onClose={() => {}}>
          <Modal.Body>
            <InputSelect
              onSelect={() => {}}
              initialValues={options}
              menuIsOpen
              menuPortalTarget={outside}
            />
          </Modal.Body>
        </Modal>,
      )

      const option = await findOption()
      // behind the dialog and inert there
      expect(outside).not.toContainElement(option)
      expect(getDialog("modal")).toContainElement(option)

      outside.remove()
    })

    test("should keep a target inside the dialog", async () => {
      const Inner = (): React.JSX.Element => {
        const [target, setTarget] = useState<HTMLDivElement | null>(null)
        return (
          <>
            <div ref={setTarget} data-testid="target" />
            <InputSelect
              onSelect={() => {}}
              initialValues={options}
              menuIsOpen
              menuPortalTarget={target}
            />
          </>
        )
      }

      render(
        <Modal show onClose={() => {}}>
          <Modal.Body>
            <Inner />
          </Modal.Body>
        </Modal>,
      )

      await waitFor(async () => {
        expect(screen.getByTestId("target")).toContainElement(
          await findOption(),
        )
      })
    })
  })
})

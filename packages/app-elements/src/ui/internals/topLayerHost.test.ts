import { enterTopLayer, getTopLayerHost, leaveTopLayer } from "./topLayerHost"

describe("topLayerHost", () => {
  test("Should follow the topmost open dialog and hand back on close", () => {
    const drawer = document.createElement("dialog")
    const modal = document.createElement("dialog")
    document.body.append(drawer, modal)
    const host = getTopLayerHost()
    expect(host.parentElement).toBe(document.body)

    enterTopLayer(drawer)
    expect(host.parentElement).toBe(drawer)

    // a modal opened from the drawer
    enterTopLayer(modal)
    expect(host.parentElement).toBe(modal)

    leaveTopLayer(modal)
    expect(host.parentElement).toBe(drawer)

    leaveTopLayer(drawer)
    expect(host.parentElement).toBe(document.body)

    drawer.remove()
    modal.remove()
  })

  test("Should cope with dialogs closing out of order", () => {
    const first = document.createElement("dialog")
    const second = document.createElement("dialog")
    document.body.append(first, second)
    const host = getTopLayerHost()

    enterTopLayer(first)
    enterTopLayer(second)
    leaveTopLayer(first)
    expect(host.parentElement).toBe(second)

    leaveTopLayer(second)
    expect(host.parentElement).toBe(document.body)

    first.remove()
    second.remove()
  })

  test("Should hand Escape to the topmost dialog only, as a cancel event", () => {
    const drawer = document.createElement("dialog")
    const modal = document.createElement("dialog")
    document.body.append(drawer, modal)
    const onDrawerCancel = vi.fn()
    const onModalCancel = vi.fn()
    drawer.addEventListener("cancel", onDrawerCancel)
    modal.addEventListener("cancel", onModalCancel)

    enterTopLayer(drawer)
    enterTopLayer(modal)
    const escapeKey = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    })
    document.body.dispatchEvent(escapeKey)
    // the browser never gets to close the dialog on its own
    expect(escapeKey.defaultPrevented).toBe(true)
    expect(onModalCancel).toHaveBeenCalledTimes(1)
    expect(onDrawerCancel).not.toHaveBeenCalled()

    leaveTopLayer(modal)
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    )
    expect(onDrawerCancel).toHaveBeenCalledTimes(1)

    leaveTopLayer(drawer)
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    )
    expect(onDrawerCancel).toHaveBeenCalledTimes(1)

    drawer.remove()
    modal.remove()
  })

  test("Should leave an Escape that something else already handled", () => {
    const dialog = document.createElement("dialog")
    document.body.append(dialog)
    const onCancel = vi.fn()
    dialog.addEventListener("cancel", onCancel)

    enterTopLayer(dialog)
    // as an open select menu does
    const input = document.createElement("input")
    dialog.append(input)
    input.addEventListener("keydown", (event) => event.preventDefault())
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onCancel).not.toHaveBeenCalled()

    leaveTopLayer(dialog)
    dialog.remove()
  })
})

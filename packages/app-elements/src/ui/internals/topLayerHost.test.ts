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
})

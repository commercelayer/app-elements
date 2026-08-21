import {
  refreshResourceLists,
  removeFromResourceLists,
  subscribeToResourceLists,
} from "./resourceListSignals"

describe("resourceListSignals", () => {
  it("delivers a removeItem signal to the subscribers of that resource type", () => {
    const subscriber = vi.fn()
    const unsubscribe = subscribeToResourceLists("orders", subscriber)

    removeFromResourceLists("orders", "order-1")

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith({
      kind: "removeItem",
      resourceId: "order-1",
    })
    unsubscribe()
  })

  it("delivers a refresh signal", () => {
    const subscriber = vi.fn()
    const unsubscribe = subscribeToResourceLists("orders", subscriber)

    refreshResourceLists("orders")

    expect(subscriber).toHaveBeenCalledWith({ kind: "refresh" })
    unsubscribe()
  })

  it("notifies every list of the same type, so two tables on one page stay in sync", () => {
    const first = vi.fn()
    const second = vi.fn()
    const unsubscribeFirst = subscribeToResourceLists("orders", first)
    const unsubscribeSecond = subscribeToResourceLists("orders", second)

    removeFromResourceLists("orders", "order-1")

    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
    unsubscribeFirst()
    unsubscribeSecond()
  })

  it("does not leak across resource types", () => {
    const orders = vi.fn()
    const skus = vi.fn()
    const unsubscribeOrders = subscribeToResourceLists("orders", orders)
    const unsubscribeSkus = subscribeToResourceLists("skus", skus)

    removeFromResourceLists("skus", "sku-1")

    expect(skus).toHaveBeenCalledTimes(1)
    expect(orders).not.toHaveBeenCalled()
    unsubscribeOrders()
    unsubscribeSkus()
  })

  it("stops notifying after unsubscribe", () => {
    const subscriber = vi.fn()
    const unsubscribe = subscribeToResourceLists("orders", subscriber)
    unsubscribe()

    removeFromResourceLists("orders", "order-1")

    expect(subscriber).not.toHaveBeenCalled()
  })

  it("is a no-op when no list is mounted", () => {
    expect(() => {
      removeFromResourceLists("orders", "order-1")
      refreshResourceLists("orders")
    }).not.toThrow()
  })

  it("survives a subscriber unsubscribing while being notified", () => {
    const second = vi.fn()
    let unsubscribeSecond = (): void => {}
    const unsubscribeFirst = subscribeToResourceLists("orders", () => {
      // a list unmounting as a reaction to the signal must not skip the others
      unsubscribeSecond()
    })
    unsubscribeSecond = subscribeToResourceLists("orders", second)

    expect(() => {
      removeFromResourceLists("orders", "order-1")
    }).not.toThrow()
    expect(second).toHaveBeenCalledTimes(1)

    unsubscribeFirst()
  })
})

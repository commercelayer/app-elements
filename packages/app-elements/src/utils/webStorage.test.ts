import { readWebStorage, writeWebStorage } from "./webStorage"

describe("webStorage", () => {
  afterEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  test("Should write and read back a JSON value in the chosen area", () => {
    writeWebStorage("localStorage", "key", { a: 1 })
    expect(readWebStorage("localStorage", "key")).toEqual({ a: 1 })
    expect(readWebStorage("sessionStorage", "key")).toBeUndefined()
  })

  test("Should return undefined for a missing or unparseable entry", () => {
    expect(readWebStorage("localStorage", "missing")).toBeUndefined()
    window.localStorage.setItem("broken", "{not json")
    expect(readWebStorage("localStorage", "broken")).toBeUndefined()
  })

  test("Should swallow storage errors", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError")
    })
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError")
    })
    expect(() => {
      writeWebStorage("localStorage", "key", 1)
    }).not.toThrow()
    expect(readWebStorage("localStorage", "key")).toBeUndefined()
  })
})

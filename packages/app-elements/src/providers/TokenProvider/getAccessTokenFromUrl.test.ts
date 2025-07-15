import { getAccessTokenFromUrl, getCurrentMode } from "./getAccessTokenFromUrl"

describe("Read JWT from URL", () => {
  const { location } = window
  beforeAll(function clearLocation() {
    delete (window as any).location
    ;(window as any).location = {
      ...location,
      href: "http://domain.com",
      search: "",
    }
  })
  afterAll(function resetLocation() {
    ;(window as typeof globalThis).location = location
  })

  test("accessToken exists in URL params", () => {
    window.location.search = "?accessToken=eyJhbGciOiJIUzUxMiJ9"
    expect(getAccessTokenFromUrl()).toBe("eyJhbGciOiJIUzUxMiJ9")
  })

  test("accessToken exists un URL along with other params", () => {
    window.location.search =
      "?foo=bar&accessToken=eyJhbGciOiJIUzUxMiJ9&client=abc123"
    expect(getAccessTokenFromUrl()).toBe("eyJhbGciOiJIUzUxMiJ9")
  })

  test("accessToken is empty", () => {
    window.location.search = "?accessToken="
    expect(getAccessTokenFromUrl()).toBe(null)
  })

  test("Query string is empty", () => {
    window.location.search = ""
    expect(getAccessTokenFromUrl()).toBe(null)
  })
})

describe("getCurrentMode", () => {
  const originalLocationObj = window.location
  beforeEach(() => {
    ;(window as typeof globalThis).location = {
      ...originalLocationObj,
    }
  })

  afterEach(() => {
    ;(window as typeof globalThis).location = originalLocationObj
  })

  test("should return the mode from the access token", () => {
    expect(
      getCurrentMode({
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NTI3OTUxMDIsInJhbmQiOjAuMzE0NTUwMDUwMTg4ODYzOH0.mX4A08-f_vdab6_dDpA1eDdGri91kR0erP8X7obZr1M",
      }),
    ).toBe("test")
  })

  test("should return test mode from the URL params", () => {
    window.location.search = "?mode=test"
    expect(getCurrentMode({ accessToken: null })).toBe("test")
  })

  test("should return live mode from the URL params", () => {
    window.location.search = "?mode=live"
    expect(getCurrentMode({ accessToken: null })).toBe("live")
  })
})

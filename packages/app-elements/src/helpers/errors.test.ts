import { describe, expect, it } from "vitest"
import { parseApiError } from "./errors"

// Build an error that match Core errors and satisfies CommerceLayerStatic.isApiError at runtime.
function makeApiError(
  message: string,
  errors: any[],
): Error & { errors: any[] } {
  const err = Object.assign(new Error(message), {
    name: "ApiError",
    type: "response",
    errors,
  })
  return err
}

describe("parseApiError", () => {
  it("returns an empty array when err is null", () => {
    expect(parseApiError(null)).toEqual([])
  })

  it("returns an empty array when err is undefined", () => {
    expect(parseApiError(undefined)).toEqual([])
  })

  it("returns err.errors when err is a real ApiError with an errors array", () => {
    const apiErrors = [
      {
        title: "Locked resource",
        detail: "Failed to destroy SkuListItem with id=1286",
        code: "LOCKED",
        status: "423",
      },
      {
        title: "Record Not Found",
        detail:
          "The requested resource was not not found. Please double-check the resource id.",
        code: "RECORD_NOT_FOUND",
        status: 404,
      },
    ]
    const err = makeApiError("Unprocessable Entity", apiErrors)
    const result = parseApiError(err)
    expect(result).toEqual(apiErrors)
  })

  it("returns a generic error when err is a real ApiError but errors is not an array", () => {
    const err = makeApiError("Something broke", null as any)
    const result = parseApiError(err)
    expect(result).toEqual([
      {
        code: "Generic error",
        detail: "Something broke",
        status: "500",
        title: "Something broke",
      },
    ])
  })

  it("returns a generic error with message when err is a plain Error", () => {
    const result = parseApiError(new Error("Network failure"))
    expect(result).toEqual([
      {
        code: "Generic error",
        detail: "Network failure",
        status: "500",
        title: "Network failure",
      },
    ])
  })

  it("returns the default fallback error when err has no message", () => {
    const result = parseApiError({})
    expect(result).toEqual([
      {
        code: "Generic error",
        detail: "Something went wrong. Please try again.",
        status: "500",
        title: "Generic error",
      },
    ])
  })

  it("uses the custom fallback when provided and err has no message", () => {
    const result = parseApiError({}, "Custom fallback message")
    expect(result).toEqual([
      {
        code: "Generic error",
        detail: "Custom fallback message",
        status: "500",
        title: "Generic error",
      },
    ])
  })
})

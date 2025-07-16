import { setApiFormErrors } from "./setApiFormErrors"

describe("setApiFormErrors", () => {
  test("should set errors", () => {
    const MockedSetError = vi.fn()

    setApiFormErrors({
      apiError: {
        errors: [
          {
            code: "VALIDATION_ERROR",
            title: "Required field",
            detail: "first_name - is required",
            source: {
              pointer: "/data/attributes/first_name",
            },
          },
          {
            code: "VALIDATION_ERROR",
            title: "Required field",
            detail: "phone - is required",
            source: {
              pointer: "/data/attributes/phone",
            },
          },
          {
            title: "Bad request",
            code: "UNKNOWN_ERROR",
            detail: "Too many params",
          },
        ],
      },
      setError: MockedSetError,
      formFields: ["first_name", "phone"],
    })

    expect(MockedSetError).toHaveBeenCalledWith(
      "first_name",
      {
        type: "serverValidation",
        message: "Required field",
      },
      {
        shouldFocus: true,
      },
    )

    expect(MockedSetError).toHaveBeenCalledWith(
      "phone",
      {
        type: "serverValidation",
        message: "Required field",
      },
      {
        shouldFocus: false,
      },
    )

    expect(MockedSetError).toHaveBeenCalledWith("root.apiError", {
      type: "server",
      message: "Too many params",
    })

    expect(MockedSetError).toHaveBeenCalledTimes(3)
  })

  test("should accept a map object", () => {
    const MockedSetError = vi.fn()

    setApiFormErrors({
      apiError: {
        errors: [
          {
            code: "VALIDATION_ERROR",
            title: "Required field",
            detail: "first_name - is required",
            source: {
              pointer: "/data/attributes/first_name",
            },
          },
        ],
      },
      setError: MockedSetError,
      formFields: ["myCustomFieldName"],
      fieldMap: {
        first_name: "myCustomFieldName",
      },
    })

    expect(MockedSetError).toHaveBeenCalledWith(
      "myCustomFieldName",
      {
        type: "serverValidation",
        message: "Required field",
      },
      {
        shouldFocus: true,
      },
    )
  })

  test("should treat as `root.apiError` a validation error for a field not found in formFields", () => {
    const MockedSetError = vi.fn()

    setApiFormErrors({
      apiError: {
        errors: [
          {
            code: "VALIDATION_ERROR",
            title: "Required field",
            detail: "first_name - is required",
            source: {
              pointer: "/data/attributes/first_name",
            },
          },
          {
            code: "VALIDATION_ERROR",
            title: "Required field",
            detail: "phone - is required",
            source: {
              pointer: "/data/attributes/phone",
            },
          },
        ],
      },
      setError: MockedSetError,
      formFields: ["first_name"],
    })

    // validation error since first_name is in formFields
    expect(MockedSetError).toHaveBeenCalledWith(
      "first_name",
      {
        type: "serverValidation",
        message: "Required field",
      },
      {
        shouldFocus: true,
      },
    )

    // generic error since phone is not in formFields
    expect(MockedSetError).toHaveBeenCalledWith("root.apiError", {
      type: "server",
      message: "phone - is required",
    })

    expect(MockedSetError).toHaveBeenCalledTimes(2)
  })
})

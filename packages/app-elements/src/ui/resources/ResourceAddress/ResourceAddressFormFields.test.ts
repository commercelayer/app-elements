import { getResourceAddressFormFieldsSchema } from "./ResourceAddressFormFields"

const validAddress = {
  first_name: "John",
  last_name: "Doe",
  line_1: "Via Roma 1",
  city: "Florence",
  state_code: "FI",
  country_code: "IT",
  phone: "+39 055 123456",
}

function issuesOf(value: unknown, requiresBillingInfo = false) {
  const result = getResourceAddressFormFieldsSchema({
    requiresBillingInfo,
  }).safeParse(value)
  return result.error?.issues.map(({ path, message }) => ({ path, message }))
}

describe("getResourceAddressFormFieldsSchema", () => {
  test("should accept a complete address", () => {
    expect(issuesOf(validAddress)).toBeUndefined()
  })

  test("should report a missing required field as required", () => {
    expect(issuesOf({ ...validAddress, city: undefined })).toEqual([
      { path: ["city"], message: "Required field" },
    ])
  })

  test("should report an empty required field as required", () => {
    expect(issuesOf({ ...validAddress, city: "" })).toEqual([
      { path: ["city"], message: "Required field" },
    ])
  })

  test("should report a null required field as an invalid format", () => {
    expect(issuesOf({ ...validAddress, state_code: null })).toEqual([
      { path: ["state_code"], message: "Invalid format" },
    ])
  })

  test("should require billing info only when asked to", () => {
    expect(issuesOf(validAddress, false)).toBeUndefined()
    expect(issuesOf(validAddress, true)).toEqual([
      { path: ["billing_info"], message: "Required field" },
    ])
  })

  test("should reject an invalid email", () => {
    expect(issuesOf({ ...validAddress, email: "not-an-email" })).toEqual([
      { path: ["email"], message: expect.any(String) },
    ])
  })

  test("should require first and last name for a person", () => {
    expect(
      issuesOf({ ...validAddress, first_name: "", last_name: null }),
    ).toEqual([
      { path: ["first_name"], message: expect.any(String) },
      { path: ["last_name"], message: expect.any(String) },
    ])
  })

  test("should require the company, not the names, for a business", () => {
    expect(
      issuesOf({
        ...validAddress,
        business: true,
        first_name: null,
        last_name: null,
      }),
    ).toEqual([{ path: ["company"], message: expect.any(String) }])
  })

  test("should not check the names while a field is invalid", () => {
    expect(
      issuesOf({ ...validAddress, first_name: "", city: undefined }),
    ).toEqual([{ path: ["city"], message: "Required field" }])
  })

  test("should default business to false", () => {
    expect(
      getResourceAddressFormFieldsSchema().parse(validAddress).business,
    ).toBe(false)
  })
})

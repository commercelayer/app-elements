import { computeFullname, formatDisplayName } from "./name"

describe("formatDisplayName", () => {
  test("should return empty string if both first and last name are empty", () => {
    expect(formatDisplayName("", "")).toBe("")
  })

  test("should return last name if first name is empty", () => {
    expect(formatDisplayName("", "Doe")).toBe("Doe")
  })

  test("should return first name if last name is empty", () => {
    expect(formatDisplayName("John", "")).toBe("John")
  })

  test("should return fullname if first name is 1 char long", () => {
    expect(formatDisplayName("J", "Reed")).toBe("J Reed")
  })

  test("should return initial for first name in most of the cases", () => {
    expect(formatDisplayName("John", "Reed")).toBe("J. Reed")
  })
})

describe("computeFullname", () => {
  test("should return full name", () => {
    expect(computeFullname("John", "Reed")).toBe("John Reed")
  })

  test("should trim white spaces", () => {
    expect(computeFullname(" ", "Reed ")).toBe("Reed")
    expect(computeFullname("John", "")).toBe("John")
  })

  test("should allow undefined values", () => {
    expect(computeFullname("John")).toBe("John")
  })
})

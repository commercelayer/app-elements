import { extractDomainFromApiBaseEndpoint } from "./url"

describe("extractDomainFromApiBaseEndpoint", () => {
  test("should return the domain from the apiBaseEndpoint", () => {
    expect(
      extractDomainFromApiBaseEndpoint("https://demo-store.commercelayer.io"),
    ).toBe("commercelayer.io")

    expect(
      extractDomainFromApiBaseEndpoint(
        "https://demo-store.foo.commercelayer.io",
      ),
    ).toBe("foo.commercelayer.io")
  })
})

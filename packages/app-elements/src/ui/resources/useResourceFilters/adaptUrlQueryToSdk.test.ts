import { adaptUrlQueryToSdk } from "./adaptUrlQueryToSdk"
import { instructions } from "./mockedInstructions"

describe("adaptUrlQueryToSdk", () => {
  test("should return a valid SDK filter object", () => {
    expect(
      adaptUrlQueryToSdk({
        queryString:
          "market_id_in=dlQbPhNNop&status_in=approved&status_in=cancelled",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: "dlQbPhNNop",
      status_in: "approved,cancelled",
      archived_at_null: true,
    })
  })

  test("should ignore empty values", () => {
    expect(
      adaptUrlQueryToSdk({
        queryString: "market_id_in=&status_in=approved&status_in=cancelled",
        instructions,
      }),
    ).toStrictEqual({
      status_in: "approved,cancelled",
      archived_at_null: true,
    })
  })

  test("should return invalid status preset if not in url ", () => {
    expect(
      adaptUrlQueryToSdk({
        queryString: "payment_status_eq=authorized",
        instructions,
      }),
    ).toStrictEqual({
      status_in: "placed,approved,cancelled",
      payment_status_eq: "authorized",
      archived_at_null: true,
    })
  })

  test("should return invalid status preset when query string is empty or undefined", () => {
    expect(
      adaptUrlQueryToSdk({
        queryString: "",
        instructions,
      }),
    ).toStrictEqual({
      status_in: "placed,approved,cancelled",
      archived_at_null: true,
    })
  })

  test("should ignore invalid values in query string", () => {
    expect(
      adaptUrlQueryToSdk({
        queryString:
          "status_in=approved&payment_status_eq=not-existing&status_in=draft&lastname_eq=doe",
        instructions,
      }),
    ).toStrictEqual({
      status_in: "approved",
      archived_at_null: true,
    })
  })

  test("should consider the query string whitelist", () => {
    expect(
      adaptUrlQueryToSdk({
        queryString:
          "status_in=approved&payment_status_eq=not-existing&status_in=draft&lastname_eq=doe",
        predicateWhitelist: ["lastname_eq"],
        instructions,
      }),
    ).toStrictEqual({
      status_in: "approved",
      lastname_eq: "doe",
      archived_at_null: true,
    })
  })
})

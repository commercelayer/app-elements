import { adaptFormValuesToSdk } from "./adaptFormValuesToSdk"
import { adaptUrlQueryToFormValues } from "./adaptUrlQueryToFormValues"
import { instructions } from "./mockedInstructions"
import type { FiltersInstructions } from "./types"

describe("adaptUrlQueryToFormValues", () => {
  test("should build proper form value object", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          "market_id_in=dFDdasdgAN&market_id_in=KToVGDooQp&status_in=cancelled&number_or_email_cont=foobar&viewTitle=Awaiting%20Approval",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: ["dFDdasdgAN", "KToVGDooQp"],
      status_in: ["cancelled"],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: "foobar",
      viewTitle: "Awaiting Approval",
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should strip out params from query string when not defined in the instructions", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: "lastname_eq=doe",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: [],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should include whitelisted predicates", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: "lastname_eq=doe",
        instructions,
        predicateWhitelist: ["lastname_eq"],
      }),
    ).toStrictEqual({
      lastname_eq: "doe",
      market_id_in: [],
      status_in: [],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should build proper form value object when partially empty", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: "market_id_in=&status_in=approved",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: ["approved"],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should build proper form value object when empty", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: "",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: [],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should build proper form value object when data are wrong", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          "payment_status_eq=invalid-value&status_in=draft&status_in=placed",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: ["placed"],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should handle currency range values", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          "status_in=placed&currency_code_eq=USD&total_amount_cents_gteq=1500&total_amount_cents_lteq=20000",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: ["placed"],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: 1500,
        to: 20000,
        currencyCode: "USD",
      },
    })
  })

  test("should parse a groupedPredicates option value from the query string", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: "quantity_filter=has_items",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: [],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: "has_items",
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should discard an invalid groupedPredicates option value from the query string", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString: "quantity_filter=not_a_valid_option",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: [],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: undefined,
        currencyCode: undefined,
      },
    })
  })

  test("should handle partial currency range values", () => {
    expect(
      adaptUrlQueryToFormValues({
        queryString:
          "status_in=placed&currency_code_eq=USD&total_amount_cents_lteq=1500",
        instructions,
      }),
    ).toStrictEqual({
      market_id_in: [],
      status_in: ["placed"],
      payment_status_eq: undefined,
      fulfillment_status_in: [],
      quantity_filter: undefined,
      archived_at_null: undefined,
      timePreset: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      name_eq: undefined,
      number_or_email_cont: undefined,
      viewTitle: undefined,
      total_amount_cents: {
        from: undefined,
        to: 1500,
        currencyCode: "USD",
      },
    })
  })

  test("unwraps a single-valued select, as it does for a single-mode toggle", () => {
    // a select says it is single-valued through `isMulti`, a toggle through
    // `mode`. Left as the array the query string parses into, a predicate reading
    // the value sees `["hide"]` and takes the branch meant for anything but
    // "hide" — which is how a scoping filter ends up excluding every record.
    const singleSelect: FiltersInstructions = [
      {
        label: "Archived",
        type: "options",
        sdk: {
          predicate: "archived_at_null",
          parseFormValue: (value) =>
            value === "show" ? undefined : value === "hide",
        },
        render: {
          component: "inputSelect",
          props: {
            isMulti: false,
            options: [
              { value: "only", label: "Only archived" },
              { value: "hide", label: "Hide archived" },
              { value: "show", label: "Show all" },
            ],
          },
        },
      },
    ]

    const formValues = adaptUrlQueryToFormValues({
      queryString: "archived_at_null=hide",
      instructions: singleSelect,
    })
    expect(formValues.archived_at_null).toBe("hide")

    expect(
      adaptFormValuesToSdk({ formValues, instructions: singleSelect }),
    ).toStrictEqual({ archived_at_null: true })
  })
})

import { makeSdkFilterTime, timeRangeValidationSchema } from "./timeUtils"

describe("timeRangeValidationSchema", () => {
  function issuesOf(value: unknown) {
    return timeRangeValidationSchema
      .safeParse(value)
      .error?.issues.map(({ path, message }) => ({ path, message }))
  }

  test("should accept a preset without dates", () => {
    expect(issuesOf({ timePreset: "last7days" })).toBeUndefined()
  })

  test("should require both dates for a custom range", () => {
    expect(issuesOf({ timePreset: "custom" })).toEqual([
      { path: ["timeFrom"], message: 'Please enter a valid "From" date' },
      { path: ["timeTo"], message: 'Please enter a valid "To" date' },
    ])
  })

  test("should reject a custom range that ends before it starts", () => {
    expect(
      issuesOf({
        timePreset: "custom",
        timeFrom: new Date("2023-04-05"),
        timeTo: new Date("2023-04-01"),
      }),
    ).toEqual([
      {
        path: ["timeTo"],
        message: 'The "To" date must be greater than the "From" date',
      },
    ])
  })

  test("should keep the other filter fields as they are", () => {
    expect(
      timeRangeValidationSchema.parse({
        timePreset: "today",
        status_in: ["placed"],
      }),
    ).toEqual({ timePreset: "today", status_in: ["placed"] })
  })
})

describe("makeSdkFilterTime", () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime("2023-04-05T15:20:00.000Z")
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test("should ignore from and to when preset is not custom", () => {
    expect(
      makeSdkFilterTime({
        timePreset: "last7days",
        timeFrom: new Date(),
        timeTo: new Date(),
        timezone: "Europe/Rome",
        sdkFilterName: "updated_at",
      }),
    ).toStrictEqual({
      updated_at_gteq: "2023-03-28T22:00:00.000Z",
    })
  })

  test("should return a range filter", () => {
    expect(
      makeSdkFilterTime({
        timePreset: "custom",
        timeFrom: new Date(),
        timeTo: new Date(),
        timezone: "Europe/Athens",
        sdkFilterName: "created_at",
      }),
    ).toStrictEqual({
      created_at_gteq: "2023-04-04T21:00:00.000Z",
      created_at_lteq: "2023-04-05T20:59:59.999Z",
    })
  })

  test("should return no filter when preset is custom but range is missing", () => {
    expect(
      makeSdkFilterTime({
        timePreset: "custom",
        timeFrom: new Date(),
        sdkFilterName: "updated_at",
      }),
    ).toStrictEqual({})

    expect(
      makeSdkFilterTime({
        timePreset: "custom",
        timeTo: new Date(),
        sdkFilterName: "updated_at",
      }),
    ).toStrictEqual({})

    expect(
      makeSdkFilterTime({
        timePreset: "custom",
        // @ts-expect-error - testing invalid date
        timeTo: "abcdef",
      }),
    ).toStrictEqual({})
  })
})

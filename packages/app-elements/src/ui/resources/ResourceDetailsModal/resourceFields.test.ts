import type { Resource } from "@commercelayer/sdk"
import { isRelationshipValue, splitResourceFields } from "./resourceFields"

/**
 * Trimmed from a real gift-card payment session. It covers every case that
 * matters: plain attributes, free-form JSON blobs, sideloaded has-one and
 * has-many relationships, an emptied has-many and a null has-one.
 */
const paymentSession = {
  id: "rRnybSmqjv",
  type: "payment_sessions",
  status: "paid",
  amount_cents: 3000,
  formatted_amount: "$30.00",
  gift_card_code: "2QP2A4QEBV",
  created_at: "2026-05-25T14:07:03.204Z",
  options: {},
  client_data: { gift_card_code: "2QP2A4QEBV" },
  response_data: { code: "2QP2A4QEBV", status: "active", balance_cents: 3000 },
  metadata: { api_version: "2026-05" },
  payment_setting: {
    id: "JwNWwjIYNB",
    type: "payment_setting_gift_cards",
    name: "Gift Card Payment Setting",
  },
  payment_authorization: { id: "ObvanTNzXq", type: "payment_authorizations" },
  payment_transactions: [
    { id: "kDrVYTkJDl", type: "payment_transactions" },
    { id: "ObvanTNzXq", type: "payment_transactions" },
  ],
  payment_captures: [{ id: "kDrVYTkJDl", type: "payment_captures" }],
  payment_refunds: [],
  payment_void: null,
} as unknown as Resource

describe("isRelationshipValue", () => {
  it("recognizes a sideloaded has-one relationship", () => {
    expect(
      isRelationshipValue({ id: "ObvanTNzXq", type: "payment_authorizations" }),
    ).toBe(true)
  })

  it("recognizes a sideloaded has-many relationship", () => {
    expect(
      isRelationshipValue([{ id: "kDrVYTkJDl", type: "payment_captures" }]),
    ).toBe(true)
  })

  it("treats an empty array as a relationship", () => {
    expect(isRelationshipValue([])).toBe(true)
  })

  it("rejects a JSON blob that has no resource type", () => {
    expect(isRelationshipValue({ api_version: "2026-05" })).toBe(false)
  })

  it("rejects a JSON blob whose type is not a real resource", () => {
    expect(isRelationshipValue({ id: "pi_3Taz", type: "payment_intent" })).toBe(
      false,
    )
  })

  it("rejects an array of plain objects", () => {
    expect(
      isRelationshipValue([
        { datetime: "2026-05-25", balance_change_cents: 3000 },
      ]),
    ).toBe(false)
  })

  it.each([null, undefined, "", 0, false, "payment_sessions"])(
    "rejects the primitive %p",
    (value) => {
      expect(isRelationshipValue(value)).toBe(false)
    },
  )
})

describe("splitResourceFields", () => {
  const { attributes, relationships } = splitResourceFields(paymentSession)

  it("excludes id and type", () => {
    expect(attributes).not.toContain("id")
    expect(attributes).not.toContain("type")
    expect(relationships).not.toContain("id")
    expect(relationships).not.toContain("type")
  })

  it("keeps free-form JSON attributes out of the relationships", () => {
    for (const key of ["metadata", "client_data", "response_data", "options"]) {
      expect(attributes).toContain(key)
      expect(relationships).not.toContain(key)
    }
  })

  it("collects every relationship, including emptied and null ones", () => {
    expect(relationships).toEqual([
      "payment_authorization",
      "payment_captures",
      "payment_refunds",
      "payment_setting",
      "payment_transactions",
    ])
  })

  it("treats a null has-one as an attribute, since the payload cannot prove otherwise", () => {
    expect(attributes).toContain("payment_void")
  })

  it("returns attributes sorted alphabetically", () => {
    expect(attributes).toEqual([...attributes].sort())
  })

  it("assigns every key to exactly one group", () => {
    const { id, type, ...rest } = paymentSession
    expect([...attributes, ...relationships].sort()).toEqual(
      Object.keys(rest).sort(),
    )
  })
})

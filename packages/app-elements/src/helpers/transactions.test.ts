import type { Authorization, Capture } from "@commercelayer/sdk"
import { orderTransactionIsAnAsyncCapture } from "./transactions"

const capture: Capture = {
  id: "capture-id",
  type: "captures",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  succeeded: false,
  message: "",
  error_code: "",
  amount_cents: 1000,
  currency_code: "USD",
  amount_float: 10,
  formatted_amount: "$10.00",
  number: "123456",
}

describe("orderTransactionIsAnAsyncCapture", () => {
  it("returns false if transaction type is not 'captures'", () => {
    const transaction: Authorization = {
      type: "authorizations",
      succeeded: false,
      message: "",
      error_code: "",
      amount_cents: 1000,
      currency_code: "USD",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      id: "capture-id",
      amount_float: 10,
      formatted_amount: "$10.00",
      number: "123456",
    }
    expect(orderTransactionIsAnAsyncCapture(transaction)).toBe(false)
  })

  it("returns false if transaction.succeeded is true", () => {
    const transaction: Capture = {
      ...capture,
      succeeded: true,
      message: "",
      error_code: "",
    }
    expect(orderTransactionIsAnAsyncCapture(transaction)).toBe(false)
  })

  it("returns false if transaction.message is not empty", () => {
    const transaction: Capture = {
      ...capture,
      succeeded: false,
      message: "Some message",
      error_code: "",
    }
    expect(orderTransactionIsAnAsyncCapture(transaction)).toBe(false)
  })

  it("returns false if transaction.error_code is not empty", () => {
    const transaction: Capture = {
      ...capture,
      succeeded: false,
      message: "",
      error_code: "ERR123",
    }
    expect(orderTransactionIsAnAsyncCapture(transaction)).toBe(false)
  })

  it("returns true for async pending capture (not succeeded, empty message and error_code)", () => {
    const transaction: Capture = {
      ...capture,
      succeeded: false,
      message: "",
      error_code: "",
    }
    expect(orderTransactionIsAnAsyncCapture(transaction)).toBe(true)
  })

  it("returns true for async pending capture (not succeeded, undefined message and error_code)", () => {
    const transaction: Capture = {
      ...capture,
      succeeded: false,
      message: undefined,
      error_code: undefined,
    }
    expect(orderTransactionIsAnAsyncCapture(transaction)).toBe(true)
  })
})

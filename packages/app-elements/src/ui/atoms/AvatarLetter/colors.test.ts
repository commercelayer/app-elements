import { getTextColorForBackground } from "./colors"

describe("getTextColorForBackground", () => {
  it("should return black or white according to the best contrast ratio.", () => {
    expect(getTextColorForBackground("#FFFFFF")).toEqual("black")
    expect(getTextColorForBackground("#000000")).toEqual("white")
    expect(getTextColorForBackground("#FF0000")).toEqual("black")
    expect(getTextColorForBackground("#00FF00")).toEqual("black")
    expect(getTextColorForBackground("#0000FF")).toEqual("white")
    expect(getTextColorForBackground("#2196F3")).toEqual("black")
  })
})

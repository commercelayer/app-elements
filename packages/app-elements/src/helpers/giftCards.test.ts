import { maskGiftCardCode } from './giftCards'

describe('maskGiftCardCode', () => {
  it('should return "N/A" if the code is null', () => {
    expect(maskGiftCardCode(null)).toBe('N/A')
  })

  it('should return "N/A" if the code is undefined', () => {
    expect(maskGiftCardCode(undefined)).toBe('N/A')
  })

  it('should handle empty string as N/A', () => {
    expect(maskGiftCardCode('')).toBe('N/A')
  })

  it('should return the code if its length is 8 or less', () => {
    expect(maskGiftCardCode('12345678')).toBe('12345678')
    expect(maskGiftCardCode('1234')).toBe('1234')
  })

  it('should mask the code if its length is greater than 8', () => {
    expect(maskGiftCardCode('123456789')).toBe('··23456789')
    expect(maskGiftCardCode('abcdefghij')).toBe('··cdefghij')
  })
})

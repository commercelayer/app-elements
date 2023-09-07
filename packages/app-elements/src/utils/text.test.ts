import {
  getDeterministicValue,
  getInitials,
  humanizeString,
  isJsonPrimitive
} from './text'

describe('getDeterministicValue', () => {
  it('should return the same value for the same text', () => {
    const colors = [
      '#101111',
      '#666EFF',
      '#055463',
      '#F40009',
      '#FF656B',
      '#FFAB2E'
    ] as const

    expect(getDeterministicValue('Ringo Starr', colors)).toEqual('#FFAB2E')
    expect(getDeterministicValue('CommerceLayer', colors)).toEqual('#101111')
  })

  it('should return #FFFFFF when color array is empty', () => {
    // @ts-expect-error I want to test this scenario
    expect(getDeterministicValue('Ringo Starr', [])).toEqual('#FFFFFF')
  })
})

describe('getInitials', () => {
  it('should return initials', () => {
    expect(getInitials('Ringo Starr')).toBe('RS')
  })

  it('should return initials', () => {
    expect(getInitials('')).toBe('')
  })

  it('should return initials with one name', () => {
    expect(getInitials('Beatles')).toBe('BE')
  })

  it('should ignore extra parts', () => {
    expect(getInitials('The Beatles Tribute Band')).toBe('TB')
  })
})

describe('humanizeString', () => {
  it('should return humanized string', () => {
    expect(humanizeString('--First_Name')).toBe('First name')
  })
})

describe('isJsonPrimitive', () => {
  it('should return true when value is a valid JSON primitive', () => {
    expect(isJsonPrimitive(null)).toBe(true)
    expect(isJsonPrimitive('string')).toBe(true)
    expect(isJsonPrimitive(42)).toBe(true)
    expect(isJsonPrimitive(false)).toBe(true)
    expect(isJsonPrimitive(true)).toBe(true)
    expect(isJsonPrimitive({ firstName: 'John' })).toBe(false)
    expect(isJsonPrimitive(['ehi'])).toBe(false)
    expect(isJsonPrimitive(Symbol('desc'))).toBe(false)
  })
})

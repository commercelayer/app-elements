import { getDeterministicValue, getInitials, humanizeString } from './text'

describe('getDeterministicValue', () => {
  it('should return the same value for the same text', () => {
    const colors: string[] = [
      '#101111',
      '#666EFF',
      '#055463',
      '#F40009',
      '#FF656B',
      '#FFAB2E'
    ]

    expect(getDeterministicValue('Ringo Starr', colors)).toEqual('#FFAB2E')
    expect(getDeterministicValue('CommerceLayer', colors)).toEqual('#101111')
  })
})

describe('getInitials', () => {
  it('should return initials', () => {
    expect(getInitials('Ringo Starr')).toBe('RS')
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

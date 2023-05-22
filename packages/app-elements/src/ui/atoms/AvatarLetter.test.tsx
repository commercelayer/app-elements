import { render } from '@testing-library/react'
import {
  AvatarLetter,
  getDeterministicColor,
  getInitials
} from './AvatarLetter'

describe('AvatarLetter', () => {
  it('should render', () => {
    const { getByText } = render(<AvatarLetter text='Jon Doe' />)
    expect(getByText('JD')).toBeInTheDocument()
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

describe('getDeterministicColor', () => {
  it('should return the same color for the same text color', () => {
    const colors: string[] = [
      '#101111',
      '#666EFF',
      '#055463',
      '#F40009',
      '#FF656B',
      '#FFAB2E'
    ]

    expect(getDeterministicColor('Ringo Starr', colors)).toEqual('#FFAB2E')
    expect(getDeterministicColor('CommerceLayer', colors)).toEqual('#101111')
  })
})

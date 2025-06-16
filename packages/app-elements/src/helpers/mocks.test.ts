import type { Resource } from '@commercelayer/sdk'
import { describe, expect, it } from 'vitest'
import { isMock, isMockedId } from './mocks'

describe('isMockedId', () => {
  it('returns true for ids starting with "fake-"', () => {
    expect(isMockedId('fake-123')).toBe(true)
    expect(isMockedId('fake-abc')).toBe(true)
    expect(isMockedId('fake-')).toBe(true)
  })

  it('returns false for ids not starting with "fake-"', () => {
    expect(isMockedId('real-123')).toBe(false)
    expect(isMockedId('123-fake')).toBe(false)
    expect(isMockedId('')).toBe(false)
    expect(isMockedId('fak-e123')).toBe(false)
  })
})

describe('isMock', () => {
  it('returns true if resource.id starts with "fake-"', () => {
    const resource: Resource = {
      id: 'fake-456',
      type: 'orders',
      created_at: '',
      updated_at: ''
    }
    expect(isMock(resource)).toBe(true)
  })

  it('returns false if resource.id does not start with "fake-"', () => {
    const resource: Resource = {
      id: 'order-789',
      type: 'orders',
      created_at: '',
      updated_at: ''
    }
    expect(isMock(resource)).toBe(false)
  })
})

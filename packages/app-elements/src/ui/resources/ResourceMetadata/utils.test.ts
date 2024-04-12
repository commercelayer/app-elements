import { groupMetadataKeys } from './utils'

describe('groupMetadataKeys', () => {
  it('should group all equivalent keys and count them', () => {
    expect(groupMetadataKeys([])).toStrictEqual({})

    expect(
      groupMetadataKeys([
        {
          key: 'first_name',
          value: 'John'
        },
        {
          key: 'last_name',
          value: 'Doe'
        },
        {
          key: 'last_name',
          value: 'Doe2'
        },
        {
          key: 'age',
          value: 35
        },
        {
          key: 'first_name',
          value: 'Doe2'
        }
      ])
    ).toEqual({
      first_name: {
        count: 2,
        indexes: [0, 4]
      },
      last_name: {
        count: 2,
        indexes: [1, 2]
      },
      age: {
        count: 1,
        indexes: [3]
      }
    })
  })
})

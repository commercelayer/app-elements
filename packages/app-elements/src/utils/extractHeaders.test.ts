import { extractHeaders } from './extractHeaders'

describe('extractHeaders', () => {
  test('should extract all property keys from an array of objects', () => {
    const headers = extractHeaders([
      {
        business: 'false',
        first_name: 'George',
        last_name: 'Harrison',
        line_1: 'Viale Borgo Valsugana 93',
        city: 'Prato',
        phone: '+39 0574 933550',
        email: 'george@thebeatles.co.uk'
      },
      {
        business: 'false',
        first_name: 'George',
        last_name: 'Harrison',
        line_1: 'Viale Borgo Valsugana 93',
        city: 'Prato',
        zip_code: '59100',
        state_code: 'PO',
        country_code: 'IT',
        phone: '+39 0574 933550',
        email: 'george@thebeatles.co.uk'
      },
      {
        'field that exists only her': true
      }
    ])

    expect(headers).toMatchObject([
      'business',
      'first_name',
      'last_name',
      'line_1',
      'city',
      'phone',
      'email',
      'zip_code',
      'state_code',
      'country_code',
      'field that exists only her'
    ])
  })
})

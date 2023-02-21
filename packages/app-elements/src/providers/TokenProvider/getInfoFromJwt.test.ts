import { getInfoFromJwt } from './getInfoFromJwt'

const jwtSalesChannelOrgAcme =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NTI3OTUxMDIsInJhbmQiOjAuMzE0NTUwMDUwMTg4ODYzOH0.mX4A08-f_vdab6_dDpA1eDdGri91kR0erP8X7obZr1M'

describe('Get info from JWT', () => {
  test('Parsing a valid token', () => {
    const { kind, slug, exp } = getInfoFromJwt(jwtSalesChannelOrgAcme)
    expect(kind).toBe('sales_channel')
    expect(slug).toBe('acme')
    expect(exp).toBe(1652795102)
  })

  test('Parsing a malformed token', () => {
    const { kind, slug } = getInfoFromJwt(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    )
    expect(kind).toBe(undefined)
    expect(slug).toBe(undefined)
  })
})

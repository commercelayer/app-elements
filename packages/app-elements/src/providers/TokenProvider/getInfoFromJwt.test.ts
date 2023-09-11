import { getInfoFromJwt } from './getInfoFromJwt'

const jwtSalesChannelOrgAcme =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NTI3OTUxMDIsInJhbmQiOjAuMzE0NTUwMDUwMTg4ODYzOH0.mX4A08-f_vdab6_dDpA1eDdGri91kR0erP8X7obZr1M'

describe('Get info from JWT', () => {
  test('Parsing a valid token', () => {
    const { appKind, orgSlug, exp } = getInfoFromJwt(jwtSalesChannelOrgAcme)
    expect(appKind).toBe('sales_channel')
    expect(orgSlug).toBe('acme')
    expect(exp).toBe(1652795102)
  })

  test('Parsing a malformed token', () => {
    const { appKind, orgSlug } = getInfoFromJwt(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    )
    expect(appKind).toBe(undefined)
    expect(orgSlug).toBe(undefined)
  })
})

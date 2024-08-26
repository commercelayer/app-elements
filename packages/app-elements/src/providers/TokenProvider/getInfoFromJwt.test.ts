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

//   "scope": ""
const tokenWithEmptyStringScope =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJzY29wZSI6IiIsInRlc3QiOnRydWUsImV4cCI6MTY1Mjc5NTEwMiwicmFuZCI6MC4zMTQ1NTAwNTAxODg4NjM4fQ.5VjX9oK2pkMHxZ-O4pSS2YyAAmfGWulpz_ii5ZvF0T0'

// "scope": "market:id:qaoeabcdoJ stock_location:id:zdMabcdVbb"
const tokenWithScopeIds =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJzY29wZSI6Im1hcmtldDppZDpxYW9lYWJjZG9KIHN0b2NrX2xvY2F0aW9uOmlkOnpkTWFiY2RWYmIiLCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NTI3OTUxMDIsInJhbmQiOjAuMzE0NTUwMDUwMTg4ODYzOH0.u_D63no4nbizAwQGUR4j6WTybAW_dP6OIV7gRokX60A'

// "scope": "market:id:qaoeabcdoJ stock_location:id:zdMabcdVbb market:code:EUROPE stock_location:code:MAIN"
const tokenWithScopeCodesAndIds =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJzY29wZSI6Im1hcmtldDppZDpxYW9lYWJjZG9KIHN0b2NrX2xvY2F0aW9uOmlkOnpkTWFiY2RWYmIgbWFya2V0OmNvZGU6RVVST1BFIHN0b2NrX2xvY2F0aW9uOmNvZGU6TUFJTiIsInRlc3QiOnRydWUsImV4cCI6MTY1Mjc5NTEwMiwicmFuZCI6MC4zMTQ1NTAwNTAxODg4NjM4fQ.q-Gub7C5IkmNNK9QjttXvDxNZhwHqxh7ocO9471Br0c'

//  "scope": "market:id:qaoeabcdoJ market:id:qakufEcdoJ"
const tokenWithScopeMultiMarketIds =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJzY29wZSI6Im1hcmtldDppZDpxYW9lYWJjZG9KIG1hcmtldDppZDpxYWt1ZkVjZG9KIiwidGVzdCI6dHJ1ZSwiZXhwIjoxNjUyNzk1MTAyLCJyYW5kIjowLjMxNDU1MDA1MDE4ODg2Mzh9.r_az60tlatjL5ZAsdKu0Hyxgw7Ijo_xMHE9vbbG0ZtU'

// "scope": "stock_location:code:EU1 stock_location:code:EU2"
const tokenWithScopeMultiStockLocationCodes =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJhYmMxMjM0Iiwic2x1ZyI6ImFjbWUifSwiYXBwbGljYXRpb24iOnsiaWQiOiJiY2Q0NDIxIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJzY29wZSI6InN0b2NrX2xvY2F0aW9uOmNvZGU6RVUxIHN0b2NrX2xvY2F0aW9uOmNvZGU6RVUyIiwidGVzdCI6dHJ1ZSwiZXhwIjoxNjUyNzk1MTAyLCJyYW5kIjowLjMxNDU1MDA1MDE4ODg2Mzh9.bmcfynHE5IZSqdRDqdN_PxZrZA7JkpS6H8034K0hKhc'

describe('Get scopes from token', () => {
  test('should return empty values when token has no scope key', () => {
    const { scopes } = getInfoFromJwt(jwtSalesChannelOrgAcme)
    expect(scopes).toEqual({
      market: {},
      stock_location: {}
    })
  })
  test('should return empty values when token has empty string as scope', () => {
    const { scopes } = getInfoFromJwt(tokenWithEmptyStringScope)
    expect(scopes).toEqual({
      market: {},
      stock_location: {}
    })
  })

  test('should return valid ids as scope', () => {
    const { scopes } = getInfoFromJwt(tokenWithScopeIds)
    expect(scopes).toEqual({
      market: {
        ids: ['qaoeabcdoJ']
      },
      stock_location: {
        ids: ['zdMabcdVbb']
      }
    })
  })

  test('should return valid ids and codes as scope', () => {
    const { scopes } = getInfoFromJwt(tokenWithScopeCodesAndIds)
    expect(scopes).toEqual({
      market: {
        ids: ['qaoeabcdoJ'],
        codes: ['EUROPE']
      },
      stock_location: {
        ids: ['zdMabcdVbb'],
        codes: ['MAIN']
      }
    })
  })

  test('should return valid ids when is multi markets', () => {
    const { scopes } = getInfoFromJwt(tokenWithScopeMultiMarketIds)
    expect(scopes).toEqual({
      market: {
        ids: ['qaoeabcdoJ', 'qakufEcdoJ']
      },
      stock_location: {}
    })
  })
  test('should return valid codes when is multi stock locations', () => {
    const { scopes } = getInfoFromJwt(tokenWithScopeMultiStockLocationCodes)
    expect(scopes).toEqual({
      market: {},
      stock_location: {
        codes: ['EU1', 'EU2']
      }
    })
  })
})

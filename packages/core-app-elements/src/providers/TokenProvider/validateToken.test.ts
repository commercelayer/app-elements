import { isTokenExpired } from './validateToken'

const token =
  'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJkWGttWkZNcUdSIiwic2x1ZyI6ImdpdXNlcHBlLWltcG9ydHMiLCJlbnRlcnByaXNlIjpmYWxzZX0sImFwcGxpY2F0aW9uIjp7ImlkIjoiYU1hS21pYW5CTiIsImtpbmQiOiJpbnRlZ3JhdGlvbiIsInB1YmxpYyI6ZmFsc2V9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NjE4NjA4NzksInJhbmQiOjAuNDIzNzM0OTczNTE3NzY0OH0.1dJs_MjNl8rEa8KOSFNea921LS-PpVOaM65kNqL-yFYy4NJdpZ_HHTNAWCCX2LXV2RQ5cg241CvxPJz3IhFw2g'

test('should check expired token', () => {
  expect(isTokenExpired({ accessToken: token, compareTo: new Date() })).toBe(
    true
  )
})

test('should check not expired token', () => {
  expect(
    isTokenExpired({
      accessToken: token,
      compareTo: new Date('01/01/2022')
    })
  ).toBe(false)
})

test('token is empty', () => {
  expect(isTokenExpired({ accessToken: '', compareTo: new Date() })).toBe(true)
})

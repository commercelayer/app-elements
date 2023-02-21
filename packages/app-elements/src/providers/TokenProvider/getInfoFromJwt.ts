import jwtDecode from 'jwt-decode'
import { Mode } from './types'

interface JWTProps {
  organization: {
    slug: string
    id: string
  }
  application: {
    kind: string
  }
  exp: number
  test: boolean
}

export const getInfoFromJwt = (
  accessToken: string
): {
  slug?: string
  kind?: string
  exp?: number
  mode?: Mode
} => {
  try {
    const { organization, application, exp, test } =
      jwtDecode<JWTProps>(accessToken)

    return {
      slug: organization.slug,
      kind: application.kind,
      mode: test ? 'test' : 'live',
      exp
    }
  } catch (e) {
    return {}
  }
}

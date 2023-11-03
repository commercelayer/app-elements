import { jwtDecode } from 'jwt-decode'
import { type Mode } from './types'

interface JWTProps {
  organization: {
    slug: string
    id: string
  }
  application: {
    kind: string
    id: string
  }
  exp: number
  test: boolean
}

export const getInfoFromJwt = (
  accessToken: string
): {
  orgSlug?: string
  appKind?: string
  appId?: string
  exp?: number
  mode?: Mode
} => {
  try {
    const { organization, application, exp, test } =
      jwtDecode<JWTProps>(accessToken)

    return {
      orgSlug: organization.slug,
      appKind: application.kind,
      appId: application.id,
      mode: test ? 'test' : 'live',
      exp
    }
  } catch (e) {
    return {}
  }
}

import jwtDecode from 'jwt-decode'

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
  appSlug?: string
} => {
  try {
    const { organization, application, exp } = jwtDecode<JWTProps>(accessToken)

    return {
      slug: organization.slug,
      kind: application.kind,
      exp
    }
  } catch (e) {
    return {}
  }
}

import { jwtDecode } from "jwt-decode"
import isEmpty from "lodash-es/isEmpty"
import type { Mode } from "./types"

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
  scope?: string
}

export const getInfoFromJwt = (
  accessToken: string,
): {
  orgSlug?: string
  appKind?: string
  appId?: string
  exp?: number
  mode?: Mode
  scopes?: ParsedScopes
} => {
  try {
    const { organization, application, exp, test, scope } =
      jwtDecode<JWTProps>(accessToken)

    return {
      orgSlug: organization.slug,
      appKind: application.kind,
      appId: application.id,
      mode: test ? "test" : "live",
      scopes: parseScope(scope),
      exp,
    }
  } catch (_e) {
    return {}
  }
}

export interface ParsedScopes {
  market: {
    ids?: string[]
    codes?: string[]
  }
  stock_location: {
    ids?: string[]
    codes?: string[]
  }
}

const parseScope = (scope?: string): ParsedScopes => {
  const defaultData: ParsedScopes = {
    market: {},
    stock_location: {},
  }

  if (isEmpty(scope) || scope == null) {
    return defaultData
  }

  const scopeParts = scope.split(" ")

  const data = scopeParts.reduce((acc, part) => {
    const [type, attribute, id] = part.split(":")

    if (type !== "market" && type !== "stock_location") {
      return acc
    }

    const key:
      | keyof ParsedScopes["market"]
      | keyof ParsedScopes["stock_location"]
      | null =
      attribute === "id" ? "ids" : attribute === "code" ? "codes" : null
    if (key == null) {
      return acc
    }

    const existingValues = acc[type][key] ?? []

    return {
      ...acc,
      [type]: {
        ...acc[type],
        [key]: [...existingValues, id],
      },
    }
  }, defaultData)

  return data
}

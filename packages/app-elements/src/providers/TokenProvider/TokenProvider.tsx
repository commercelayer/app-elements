import { getCoreApiBaseEndpoint } from "@commercelayer/js-auth"
import type { ListableResourceType } from "@commercelayer/sdk"
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react"
import type { TokenProviderTokenApplicationKind } from "#providers/TokenProvider"
import {
  decodeExtras,
  getExtrasFromUrl,
  isValidUser,
} from "#providers/TokenProvider/extras"
import { extractDomainFromApiBaseEndpoint } from "#providers/TokenProvider/url"
import { PageError } from "#ui/composite/PageError"
import { PageSkeleton } from "#ui/composite/PageSkeleton"
import {
  getAccessTokenFromUrl,
  getCurrentMode,
  removeAuthParamsFromUrl,
} from "./getAccessTokenFromUrl"
import { initialTokenProviderState, reducer } from "./reducer"
import { getPersistentJWT, savePersistentJWT } from "./storage"
import type {
  TokenProviderAllowedAppSlug,
  TokenProviderAuthSettings,
  TokenProviderAuthUser,
  TokenProviderClAppSlug,
  TokenProviderExtras,
  TokenProviderRoleActions,
} from "./types"
import { makeDashboardUrl } from "./url"
import { isTokenExpired, isValidTokenForCurrentApp } from "./validateToken"

export interface TokenProviderValue {
  settings: TokenProviderAuthSettings
  user: TokenProviderAuthUser | null
  canUser: (
    action: TokenProviderRoleActions,
    resource: ListableResourceType,
  ) => boolean
  canAccess: (appSlug: TokenProviderClAppSlug) => boolean
  emitInvalidAuth: (reason: string) => void
}

export interface TokenProviderProps {
  /**
   * The token kind (will be validated).
   * For example: `integration`, `sales_channel` or `webapp` but also `imports` or `orders` in case of dashboard-generated token.
   */
  kind: TokenProviderTokenApplicationKind
  /**
   * The slug of the current app. It could match one of the allowed apps or a custom string.
   * It is used as the app identifier (e.g. storage key).
   */
  appSlug: TokenProviderAllowedAppSlug
  /**
   * Set this to `true` to skip domain slug validation in dev mode.
   */
  devMode: boolean
  /**
   * The entire app content.
   */
  children: ((props: TokenProviderValue) => ReactNode) | ReactNode
  /**
   * If present, only an access token with the same organization slug will be considered valid.
   * It will be also used to generate the local storage key when the token is persisted (unless a custom `storage` methods are provided).
   * When empty, the app will use the organization slug decoded from the token
   * and the token will be persisted using a default key ('commercelayer').
   */
  organizationSlug?: string
  /**
   * Optional. Override the internal logic to persist the access token and extra (save and retrieve).
   */
  storage?: {
    /** Custom method to retrieve the access token. It must return a valid and not expired access token */
    getAccessToken: () => string | null
    /** Custom method to save the access token in your preferred storage */
    saveAccessToken: (token: string) => void
    /** Custom method to retrieve the encoded `extra` data, if provided */
    getEncodedExtra?: () => string | null
    /** Custom method to save the encoded `extra` data, if provided, in your preferred storage */
    saveEncodedExtra?: (encodedExtra: string) => void
  }
  /**
   * The callback invoked when token is not valid.
   * Can be used to manually handle the re-authentication flow when `reauthenticateOnInvalidAuth` is false.
   */
  onInvalidAuth?: (info: { dashboardUrl: string; reason: string }) => void
  /**
   * The UI element to be used as loader (e.g. skeleton or spinner icon).
   * This element is ignored when app is running within the dashboard, since it will use the standard PageSkeleton ad not-overridable ui loader.
   */
  loadingElement?: ReactNode
  /**
   * The element to display in case of invalid token.
   */
  errorElement?: ReactNode
  /**
   * Optional. In case you already have an access token, this will skip the retrieval of token from the URL or `localStorage`.
   * When `undefined` (default scenario), the token is expected to be retrieved from the `?accessToken=xxxx` query string or localStorage (in this order).
   */
  accessToken?: string

  /**
   * Optional. Set to `true` to enable the app to be used within the dashboard.
   * In this way the UI can be adapted.
   */
  isInDashboard?: boolean
  /**
   * Optional. Define a callback to be invoked when the app is closed.
   * When this is defined, it means the app is running as micro-frontend (eg: initialized from the dashboard, that needs to handle the go back).
   * This methods will also be returned within the context as part of `TokenProviderValue` object.
   */
  onAppClose?: () => void
  /**
   * Optional. Extra data to pass from the dashboard or when the app is initialized.
   * They will be received on app init and make available in the TokenProvider > settings context.
   */
  extras?: TokenProviderExtras
}

export const AuthContext = createContext<TokenProviderValue>({
  canUser: () => false,
  canAccess: () => false,
  emitInvalidAuth: () => undefined,
  settings: initialTokenProviderState.settings,
  user: null,
})

export const useTokenProvider = (): TokenProviderValue => {
  return useContext(AuthContext)
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  kind,
  appSlug,
  devMode,
  children,
  organizationSlug,
  storage,
  onInvalidAuth,
  loadingElement,
  errorElement,
  accessToken: accessTokenFromProp,
  onAppClose,
  isInDashboard = false,
  extras: extrasFromProp,
}) => {
  const [_state, dispatch] = useReducer(reducer, initialTokenProviderState)
  const accessToken =
    accessTokenFromProp ??
    getAccessTokenFromUrl() ??
    (storage?.getAccessToken != null
      ? storage?.getAccessToken()
      : getPersistentJWT({
          appSlug,
          organizationSlug,
          itemType: "accessToken",
        }))

  const encodeExtras =
    getExtrasFromUrl() ??
    (storage?.getEncodedExtra != null
      ? storage?.getEncodedExtra()
      : getPersistentJWT({ appSlug, organizationSlug, itemType: "extras" }))

  const extras = extrasFromProp ?? decodeExtras(encodeExtras)

  const apiBaseEndpoint =
    accessToken != null ? getCoreApiBaseEndpoint(accessToken) : null
  const domain = extractDomainFromApiBaseEndpoint(apiBaseEndpoint)

  const dashboardUrl = makeDashboardUrl({
    domain,
    accessToken,
  })

  const emitInvalidAuth = useCallback((reason: string): void => {
    dispatch({ type: "invalidAuth" })
    if (onInvalidAuth != null) {
      onInvalidAuth({ dashboardUrl, reason })
    }
  }, [])

  const canUser = useCallback(
    (
      action: TokenProviderRoleActions,
      resource: ListableResourceType | "organizations",
    ): boolean => {
      if (kind === "integration") {
        return true
      }

      return Boolean(_state.rolePermissions?.[resource]?.[action])
    },
    [_state.rolePermissions],
  )

  const canAccess = useCallback(
    (appSlug: TokenProviderClAppSlug): boolean => {
      if (kind === "integration") {
        return true
      }
      return _state.accessibleApps.includes(appSlug)
    },
    [_state.accessibleApps],
  )

  useEffect(
    function validateAndSetToken() {
      void (async (): Promise<void> => {
        if (apiBaseEndpoint == null) {
          emitInvalidAuth("apiBaseEndpoint is missing")
          return
        }

        if (accessToken == null) {
          emitInvalidAuth("accessToken is missing")
          return
        }

        if (
          isTokenExpired({
            accessToken,
            compareTo: new Date(),
          })
        ) {
          emitInvalidAuth("accessToken is expired")
          return
        }

        const tokenInfo = await isValidTokenForCurrentApp({
          accessToken,
          kind,
          isProduction: !devMode,
          currentMode: getCurrentMode({ accessToken }),
          organizationSlug,
        })

        if (!tokenInfo.isValidToken) {
          emitInvalidAuth("accessToken is not valid")
          return
        }

        // all good - save token using custom storage method (if provided) or fallback to internal method
        if (storage != null) {
          storage.saveAccessToken(accessToken)
        } else {
          savePersistentJWT({
            appSlug,
            jwt: accessToken,
            organizationSlug,
            itemType: "accessToken",
          })
        }

        if (encodeExtras != null) {
          storage != null
            ? storage.saveEncodedExtra?.(encodeExtras)
            : savePersistentJWT({
                appSlug,
                jwt: encodeExtras,
                organizationSlug,
                itemType: "extras",
              })
        }

        removeAuthParamsFromUrl()

        const userFromExtras =
          extrasFromProp?.user != null && isValidUser(extrasFromProp?.user)
            ? extrasFromProp.user
            : null

        dispatch({
          type: "validToken",
          payload: {
            settings: {
              accessToken: tokenInfo.accessToken,
              organizationSlug: tokenInfo.organizationSlug,
              appSlug,
              mode: tokenInfo.mode,
              domain,
              dashboardUrl,
              onAppClose,
              isInDashboard,
              scopes: tokenInfo.scopes,
              extras,
            },
            user: tokenInfo.user ?? userFromExtras,
            rolePermissions: tokenInfo.permissions ?? {},
            accessibleApps: tokenInfo.accessibleApps ?? [],
          },
        })
      })()
    },
    [accessToken],
  )

  const value: TokenProviderValue = {
    settings: _state.settings,
    user: _state.user,
    canUser,
    canAccess,
    emitInvalidAuth,
  }

  if (_state.isTokenError) {
    return (
      <>
        {errorElement ?? (
          <PageError
            pageTitle="Invalid token"
            errorName="401"
            errorDescription="The provided authorization token is not valid. Please try to re-authenticate."
          />
        )}
      </>
    )
  }

  if (_state.isLoading) {
    return <>{isInDashboard ? <PageSkeleton /> : loadingElement}</>
  }

  return (
    <AuthContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </AuthContext.Provider>
  )
}

TokenProvider.displayName = "TokenProvider"

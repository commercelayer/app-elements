import isEmpty from "lodash-es/isEmpty"
import { useCallback, useRef } from "react"
import { useLocation, useRouter, useSearch } from "wouter"
import { useTokenProvider } from "#providers/TokenProvider"
import type { TokenProviderClAppSlug } from "#providers/TokenProvider/types"

type Layout = Record<TokenProviderClAppSlug, object | undefined>
interface AppsConfig {
  layout?: Layout
  navigation?: Record<TokenProviderClAppSlug, string | null | undefined>
}

// TODO: replace empty config with fetched config from TokenProvider
const config: { apps: AppsConfig } = {
  apps: {},
}

interface UseAppLinkingHook {
  /**
   * Navigate to internal app path, to different app (outside router base), or to an external URL.
   * Current path is saved in session storage to allow going back to it (when using `goBack`).
   */
  navigateTo: (param: { app: TokenProviderClAppSlug; resourceId?: string }) => {
    href: string
    onClick: (
      e: React.MouseEvent<
        HTMLAnchorElement | HTMLDivElement | HTMLButtonElement,
        MouseEvent
      >,
    ) => void
  } | null

  /**
   * Go back to the last visited location when `navigateTo` has been used.
   * If no saved item is found, it will navigate to the default relative
   */
  goBack: (param: {
    currentResourceId?: string
    defaultRelativePath: string
  }) => void
}

/**
 * Hook to navigate between apps from list and detail views.
 */
export function useAppLinking(): UseAppLinkingHook {
  const {
    settings: { isInDashboard, appSlug: currentAppSlug },
  } = useTokenProvider()
  const { base } = useRouter()
  const [location, setLocation] = useLocation()
  const search = useSearch()

  /**
   * `navigateTo` keeps a stable identity on purpose: it is called while rendering
   * list rows, so re-creating it on every navigation would invalidate memoized
   * rows and re-run any consumer effect that depends on it.
   *
   * That means it must not close over `location`/`search`, which change on every
   * navigation — the entry saved for "go back" has to be the url at *click* time,
   * not the one from the render that last recreated this callback. Reading them
   * from a ref keeps both properties.
   */
  const currentUrlRef = useRef({ location, search })
  currentUrlRef.current = { location, search }

  const navigateTo: UseAppLinkingHook["navigateTo"] = useCallback(
    ({ app, resourceId }) => {
      const path = resourceId != null ? `/list/${resourceId}` : `/list`

      const customInstruction =
        config?.apps?.navigation?.[app] != null
          ? clearConfigPath(config.apps.navigation[app])
          : config?.apps?.navigation?.[app] // important to keep this exactly null or undefined as it has been received, since it will have different behavior.

      const handleOnClick = (
        e: Parameters<
          NonNullable<ReturnType<UseAppLinkingHook["navigateTo"]>>["onClick"]
        >[0],
        to: string,
      ): void => {
        if (e.ctrlKey || e.metaKey) {
          // allow to open link in a new tab with ctrl+click or cmd+click
          return
        }
        e.preventDefault()

        if (isExternalUrl(to)) {
          // TODO: we can't set persistent entry for the go back from a different domain
          // probably in a future we can use a query string param
          window.location.assign(to)
        } else {
          const { location: from, search: fromSearch } = currentUrlRef.current
          saveGoBackItem({
            destinationApp: app,
            resourceId,
            returnToApp: currentAppSlug as TokenProviderClAppSlug,
            location: `${from}${!isEmpty(fromSearch) ? `?${fromSearch}` : ""}`,
          })
          setLocation(to)
        }
      }

      // is internal app link (eg: from /orders/list to /orders/list/123) )
      if (app === currentAppSlug) {
        return {
          href: `${base}${path}`,
          onClick: (e) => {
            handleOnClick(e, path)
          },
        }
      }

      if (customInstruction === null) {
        // when is explicitly set to null, don't show any link
        return null
      }

      if (customInstruction === undefined && !isInDashboard) {
        // it's not in dashboard and there is no config to instruct about cross linking we can't show any link
        return null
      }

      if (customInstruction != null) {
        // could be one of: `http://my-custom-url` or `/internal-path/shipments`
        return {
          href: `${customInstruction}${path}`,
          onClick: (event) => {
            handleOnClick(
              event,
              `${isExternalUrl(customInstruction) ? "" : "~"}${customInstruction}${path}`,
            )
          },
        }
      }

      // standard linking between different dashboard apps (core apps)
      // no custom instruction provided in config and we are in dashboard (or any app with similar structure)
      // in this case we can rely on wouter to navigate directly to a new base path
      const newBase = `${base.replace(`/${currentAppSlug}`, `/${app}`)}`
      return {
        href: `${newBase}${path}`,
        onClick: (e) => {
          handleOnClick(e, `~${newBase}${path}`)
        },
      }
    },
    [base, currentAppSlug, isInDashboard],
  )

  const goBack = useCallback(
    ({
      currentResourceId,
      defaultRelativePath,
    }: {
      currentResourceId?: string
      defaultRelativePath: string
    }) => {
      const goBackItem = getGoBackItem({
        destinationApp: currentAppSlug as TokenProviderClAppSlug,
        resourceId: currentResourceId,
      })
      if (goBackItem == null) {
        setLocation(defaultRelativePath)
        return
      }
      setLocation(
        goBackItem.returnToApp === currentAppSlug
          ? goBackItem.location // is same app
          : `~${base.replace(`/${currentAppSlug}`, `/${goBackItem.returnToApp}`)}${goBackItem.location ?? ""}`, // is new router base
      )
    },
    [base, currentAppSlug],
  )

  return {
    navigateTo,
    goBack,
  }
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://")
}

function clearConfigPath(path?: string | null): string | null {
  if (path == null) {
    return null
  }

  // enforce leading slash
  path = isExternalUrl(path) || path.startsWith("/") ? path : `/${path}`

  // remove trailing slash
  return path.endsWith("/") ? path.slice(0, -1) : path
}

interface GoBackItem {
  version: number
  returnToApp: TokenProviderClAppSlug
  location: string
}

const currentVersion = 1

function saveGoBackItem({
  destinationApp,
  resourceId,
  returnToApp,
  location,
}: {
  destinationApp: TokenProviderClAppSlug
  resourceId?: string
  returnToApp: TokenProviderClAppSlug
  location: string
}): void {
  if (typeof window === "undefined") {
    return
  }
  const itemKey = makePersistentKey({ destinationApp, resourceId })
  sessionStorage.setItem(
    itemKey,
    JSON.stringify({
      version: currentVersion,
      returnToApp,
      location,
    }),
  )
}

function getGoBackItem({
  destinationApp,
  resourceId,
}: {
  destinationApp: TokenProviderClAppSlug
  resourceId?: string
}): GoBackItem | null {
  if (typeof window === "undefined") {
    return null
  }
  const itemKey = makePersistentKey({ destinationApp, resourceId })
  const value = sessionStorage.getItem(itemKey)
  sessionStorage.removeItem(itemKey)

  try {
    const item = JSON.parse(value ?? "{}") as GoBackItem
    if (item.version === currentVersion) {
      return item
    } else {
      return null
    }
  } catch {
    return null
  }
}

function makePersistentKey({
  destinationApp,
  resourceId,
}: {
  destinationApp: TokenProviderClAppSlug
  resourceId?: string
}): string {
  return `cl.apps.nav.${destinationApp}_${resourceId ?? "list"}`
}

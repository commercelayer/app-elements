import { type ResourceTypeLock } from '@commercelayer/sdk/lib/cjs/api'
import isEmpty from 'lodash/isEmpty'

const currentVersion = 0.2

export interface BackToItem {
  /**
   * URL to be stored in sessionStorage, it will be the current URL so it can be used to navigate back.
   */
  url: string
  /**
   * Version of the data stored to check if it's compatible with the current code version.
   */
  version: number
}

/**
 * Get the item stored in sessionStorage for the current URL.
 */
function getPersistentItem(): BackToItem | undefined {
  const itemName = location.href
  try {
    const item = JSON.parse(
      sessionStorage.getItem(itemName) ?? '{}'
    ) as BackToItem
    if (item.version === currentVersion) {
      return item
    } else {
      sessionStorage.removeItem(itemName)
      return undefined
    }
  } catch {
    sessionStorage.removeItem(itemName)
    return undefined
  }
}
/**
 *  Store the current URL in sessionStorage so that can be read from the destination URL.
 */
function setPersistentItem({ destination }: { destination: string }): void {
  sessionStorage.setItem(
    destination,
    JSON.stringify({
      url: window.location.href,
      version: currentVersion
    })
  )
}

/**
 * Checks if the URL belongs to the same app by considering the hostname and the first path segment
 * and comparing it with same info for `window.location.href`
 */
function urlIsForSameApp(url: string): boolean {
  function getAppBaseUrl(url: string): string {
    const urlObj = new URL(url)
    const [, appSlug] = urlObj.pathname.split('/')

    if (appSlug === undefined) {
      throw new Error('Cannot access to the application slug.')
    }

    return `${urlObj.hostname}/${appSlug}`
  }

  return getAppBaseUrl(window.location.href) === getAppBaseUrl(url)
}

/**
 * Get the relative path from an absolute url, considering the app base path as part of the base url.
 * @example
 * ```
 * getRelativePath('https://demo-store.commercelayer.io/orders/list/qfgDgXszab?foo=bar')
 * // returns '/list/qfgDgXszab?foo=bar'
 * ```
 */
function getRelativePath(url: string): string {
  const urlObj = new URL(url)

  // remove app base path
  // eg: /orders/list/qfgDgXszab?foo=bar -> /list/qfgDgXszab?foo=bar
  const relativePath = urlObj.pathname
    .split('/')
    .filter((p) => !isEmpty(p))
    .slice(1)
    .join('/')

  return isEmpty(urlObj.search)
    ? `/${relativePath}`
    : `/${relativePath}${urlObj.search}`
}

/**
 * Navigate back to the url found in sessionStorage or to the default relative path.
 */
export function goBack({
  setLocation,
  defaultRelativePath
}: {
  /**
   * React router's history.push method, this is used when linking internal app pages.
   */
  setLocation: (url: string) => void
  /**
   * path to default list when there is no url in sessionStorage
   */
  defaultRelativePath: string
}): void {
  const item = getPersistentItem()
  if (item?.url == null) {
    setLocation(defaultRelativePath)
    return
  }

  if (urlIsForSameApp(item.url)) {
    setLocation(getRelativePath(item.url))
    return
  }

  sessionStorage.removeItem(window.location.href)
  window.location.assign(item.url)
}

interface NavigateToInternalDetailsParams {
  /**
   * React router's history.push method, this is used when linking internal app pages.
   */
  setLocation: (url: string) => void
  /**
   * destination instructions to navigate to a detail page
   */
  destination: {
    /**
     * app name to navigate to, it could be the current app (internal linking) or another app (cross linking)
     */
    app: ResourceTypeLock
    /**
     * resource id to open
     */
    resourceId: string
  }
}

interface NavigateToExternalDetailsParams {
  /**
   * destination instructions to navigate to a detail page
   */
  destination: {
    /**
     * app name to navigate to, it could be the current app (internal linking) or another app (cross linking)
     */
    app: ResourceTypeLock
    /**
     * resource id to open
     */
    resourceId: string
    /**
     * required when linking to another app, it indicates if the destination app should be opened in test or live mode
     */
    mode: 'test' | 'live'
  }
}

/**
 * Navigate to an internal or external URL or pathname and store the current url in sessionStorage
 * to be able to navigate back to it with the `goBack` function.
 */
export function navigateToDetail(
  params: NavigateToInternalDetailsParams | NavigateToExternalDetailsParams
): {
  href: string
  onClick: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void
} {
  const destinationFullUrl = `${window.location.origin}/${params.destination.app}/list/${params.destination.resourceId}`

  return {
    href: isNavigateToInternalParams(params)
      ? destinationFullUrl
      : `${destinationFullUrl}?mode=${params.destination.mode}`,
    onClick: (
      e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
    ) => {
      if (e.ctrlKey || e.metaKey) {
        // allow to open link in a new tab with ctrl+click or cmd+click
        return
      }
      e.preventDefault()
      setPersistentItem({ destination: destinationFullUrl })
      if (isNavigateToInternalParams(params)) {
        params.setLocation(getRelativePath(destinationFullUrl))
        return
      }
      window.location.assign(
        `${destinationFullUrl}?mode=${params.destination.mode}`
      )
    }
  }
}

function isNavigateToInternalParams(
  params: NavigateToInternalDetailsParams | NavigateToExternalDetailsParams
): params is NavigateToInternalDetailsParams {
  return 'setLocation' in params
}

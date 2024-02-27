import isEmpty from 'lodash/isEmpty'
import { type FC } from 'react'
import ReactDOM, { type Root } from 'react-dom/client'
import { type TokenProviderAllowedApp } from './TokenProvider'

export type ClAppKey = `clApp_${TokenProviderAllowedApp}`

/**
 * Method to mount the React application in the provider `node` with the set of options passed as `props`.
 */
type ClApp = Record<
  ClAppKey,
  {
    init: (node?: HTMLElement, props?: ClAppProps) => Root | undefined
  }
>

declare global {
  interface Window extends ClApp {
    clAppConfig: {
      /**
       * Specific domain to use for Commerce Layer API requests.
       * It must be set as `commercelayer.io`.
       */
      domain: string
      /**
       * Enable Google Tag Manager for the provided GTM ID.
       */
      gtmId?: string
    }
  }
}

export interface ClAppProps {
  /**
   * Base path for internal routing.
   * Example: `my-app` if you want to serve the app at `https://my-domain.com/my-app/`.
   */
  routerBase?: string
  /**
   * Organization slug to use for Commerce Layer API requests.
   */
  organizationSlug?: string
  /**
   * Callback to be called when the user is not authenticated or the token is invalid/expired.
   */
  onInvalidAuth?: () => void
  /**
   * Callback to be called when the app is closed (when go-back button from the app home page is clicked)
   */
  onAppClose?: () => void
  /**
   * Handle some UI elements to be hidden when the app is loaded in the dashboard.
   */
  isInDashboard?: boolean
  /**
   * Domain used for Core API requests
   * @default 'commercelayer.io'
   */
  domain?: string
}

/**
 * Create a new app instance by adding the `clApp` methods into the global `window` object.
 * The React application will them be mounted into the provided `node` element, when the `init` method is called.
 * @param children - The root component of the app.
 **/
export function createApp(
  children: FC<ClAppProps>,
  appSlug: TokenProviderAllowedApp
): void {
  window[`clApp_${appSlug}`] = {
    init: (node, props) => {
      if (node == null) {
        return
      }

      const root = ReactDOM.createRoot(node)
      root.render(
        children({
          ...props,
          domain: props?.domain ?? window.clAppConfig?.domain,
          organizationSlug: parseOrganizationSlug(props?.organizationSlug),
          routerBase: parseRouterBase(props?.routerBase)
        })
      )

      return root
    }
  }
}

function parseOrganizationSlug(organizationSlug?: string): string | undefined {
  return isEmpty(organizationSlug) // catching empty string since this might arrive from `env`
    ? undefined
    : organizationSlug
}

function parseRouterBase(path?: string): string | undefined {
  if (path == null || isEmpty(path)) {
    return
  }

  if (path.startsWith('/')) {
    return path
  } else {
    return `/${path}`
  }
}

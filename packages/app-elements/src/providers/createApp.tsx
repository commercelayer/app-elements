import isEmpty from "lodash-es/isEmpty"
import type { ReactNode } from "react"
import ReactDOM, { type Root } from "react-dom/client"
import type { TokenProviderProps } from "./TokenProvider/TokenProvider"
import type { TokenProviderAllowedAppSlug } from "./TokenProvider/types"

export type ClAppKey = `clApp_${TokenProviderAllowedAppSlug}`

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
       * Enable Google Tag Manager for the provided GTM ID.
       */
      gtmId?: string
    }
  }
}

export interface ClAppProps
  extends Partial<Omit<TokenProviderProps, "appSlug" | "children">> {
  /**
   * Base path for internal routing.
   * Example: `my-app` if you want to serve the app at `https://my-domain.com/my-app/`.
   */
  routerBase?: string
}

/**
 * Create a new app instance by adding the `clApp` methods into the global `window` object.
 * The React application will them be mounted into the provided `node` element, when the `init` method is called.
 * @param children - The root component of the app.
 **/
export function createApp(
  children: (props: ClAppProps) => ReactNode,
  appSlug: TokenProviderAllowedAppSlug,
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
          organizationSlug: parseOrganizationSlug(props?.organizationSlug),
          routerBase: parseRouterBase(props?.routerBase),
        }),
      )

      return root
    },
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

  if (path.startsWith("/")) {
    return path
  } else {
    return `/${path}`
  }
}

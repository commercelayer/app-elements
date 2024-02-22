import isEmpty from 'lodash/isEmpty'
import { type ReactNode } from 'react'
import ReactDOM, { type Root } from 'react-dom/client'

export interface ClAppOptions {
  routerBase?: string
  organizationSlug?: string
  onInvalidAuth?: () => void
  onAppClose?: () => void
  isInDashboard?: boolean
  domain?: string
}

declare global {
  interface Window {
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
    clApp?: {
      init: (node?: HTMLElement, options?: ClAppOptions) => Root | undefined
    }
  }
}

export function AppInit({
  app
}: {
  app: (options?: ClAppOptions) => ReactNode
}): void {
  window.clApp = {
    init: (node, options) => {
      if (node == null) {
        return
      }

      const root = ReactDOM.createRoot(node)
      root.render(
        app({
          ...options,
          domain: options?.domain ?? window.clAppConfig?.domain,
          organizationSlug: parseOrganizationSlug(options?.organizationSlug),
          routerBase: parseRouterBase(options?.routerBase)
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

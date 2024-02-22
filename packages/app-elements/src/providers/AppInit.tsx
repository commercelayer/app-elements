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
          routerBase: parseRouterBase(options?.routerBase)
        })
      )
      return root
    }
  }
}

function parseRouterBase(path?: string): string | undefined {
  if (path == null) {
    return
  }

  if (path.startsWith('/')) {
    return path
  } else {
    return `/${path}`
  }
}

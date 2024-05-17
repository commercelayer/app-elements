import { formatResourceName } from '#helpers/resources'
import { type ListableResourceType } from '@commercelayer/sdk'
import { useEffect } from 'react'
import { useTokenProvider } from './index'

function MetaTags(): null {
  const {
    organization,
    settings: { appSlug }
  } = useTokenProvider()

  const organizationName = organization?.name

  const appName = formatResourceName({
    resource: appSlug as ListableResourceType,
    count: 'plural',
    format: 'title'
  })

  const title =
    organizationName != null
      ? `${appName} - ${organizationName} - Commerce Layer`
      : `${appName} - Commerce Layer`

  useEffect(() => {
    if (window?.document != null) {
      window.document.title = title
    }
  }, [title])

  return null
}

MetaTags.displayName = 'MetaTags'
export { MetaTags }

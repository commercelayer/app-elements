import type { ListableResourceType } from "@commercelayer/sdk"
import { useEffect } from "react"
import { formatResourceName } from "#helpers/resources"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { useTokenProvider } from "./index"

function MetaTags(): null {
  const {
    settings: { appSlug },
  } = useTokenProvider()

  const { data: organization } = useCoreApi("organization", "retrieve", [])

  const organizationName = organization?.name

  const appName = formatResourceName({
    resource: appSlug as ListableResourceType,
    count: "plural",
    format: "title",
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

MetaTags.displayName = "MetaTags"
export { MetaTags }

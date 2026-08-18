import type { ListableResourceType, Resource } from "@commercelayer/sdk"
import { useTranslation } from "react-i18next"
import { formatDate } from "#helpers/date"
import type { I18NLocale } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { CopyToClipboard } from "#ui/atoms/CopyToClipboard"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Text } from "#ui/atoms/Text"
import { ListDetailsItem } from "#ui/composite/ListDetailsItem"
import { FlexRow } from "#ui/internals/FlexRow"
import { useSurfaceVariant } from "#ui/internals/overlayContext"
import { useEditDetailsOverlay } from "./useEditDetailsOverlay"

export interface ResourceDetailsProps {
  /**
   * How the block renders, overriding what it infers from where it sits.
   *
   * Inferred by default — `PageLayout`'s sidebar slot reports `"sidebar"`, while a
   * page and a drawer both report the wider `"default"`. Pass it only to force a
   * rendering the surrounding surface would not choose.
   */
  variant?: "default" | "sidebar"
  resource: Resource
  onUpdated: () => Promise<void>
}

/**
 * This component provides a listed visualization of details attributes of a given resource.
 */
export const ResourceDetails = withSkeletonTemplate<ResourceDetailsProps>(
  ({ resource, onUpdated, variant }) => {
    // the hook runs unconditionally; the prop only wins afterwards
    const inferredSurface = useSurfaceVariant()
    const surface = variant ?? inferredSurface
    const { user, canUser } = useTokenProvider()
    const { i18n } = useTranslation()
    const locale = i18n.language as I18NLocale
    const { Overlay: EditDetailsOverlay, show } = useEditDetailsOverlay()

    const reference = [resource?.reference, resource?.reference_origin]
      .filter(Boolean)
      .join(" · ")

    return (
      <>
        <Section surface={surface} title="Details">
          <ListDetailsItem surface={surface} label="ID" gutter="none">
            <CopyToClipboard value={resource?.id} />
          </ListDetailsItem>
          <ListDetailsItem surface={surface} label="Reference" gutter="none">
            <FlexRow alignItems="center">
              <Text weight="semibold" size="small">
                {reference}
              </Text>
              {canUser("update", resource.type as ListableResourceType) && (
                <button
                  type="button"
                  onClick={() => {
                    show()
                  }}
                >
                  <Icon name="pencilSimple" size={16} />
                </button>
              )}
            </FlexRow>
          </ListDetailsItem>
          <ListDetailsItem surface={surface} label="Updated" gutter="none">
            <Text weight="semibold" size="small">
              {formatDate({
                isoDate: resource?.updated_at,
                timezone: user?.timezone,
                format: "fullWithSeconds",
                showCurrentYear: true,
                locale,
              })}{" "}
            </Text>
          </ListDetailsItem>
          <ListDetailsItem surface={surface} label="Created" gutter="none">
            <Text weight="semibold" size="small">
              {formatDate({
                isoDate: resource?.created_at,
                timezone: user?.timezone,
                format: "fullWithSeconds",
                showCurrentYear: true,
                locale,
              })}
            </Text>
          </ListDetailsItem>
        </Section>
        <EditDetailsOverlay resource={resource} onUpdated={onUpdated} />
      </>
    )
  },
)

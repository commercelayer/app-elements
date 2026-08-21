import type { ListableResourceType, Resource } from "@commercelayer/sdk"
import { useTranslation } from "react-i18next"
import { formatDate } from "#helpers/date"
import type { I18NLocale } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { ListDetailsItem } from "#ui/composite/ListDetailsItem"
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
    const { t, i18n } = useTranslation()
    const locale = i18n.language as I18NLocale
    const { Overlay: EditDetailsOverlay, show } = useEditDetailsOverlay()

    const reference = [resource?.reference, resource?.reference_origin]
      .filter(Boolean)
      .join(" · ")

    return (
      <>
        <Section
          surface={surface}
          title="Details"
          actionButton={
            // A `…` menu, as Tags and Metadata have: the rows then carry no controls
            // of their own and read as a plain list, the same on every surface.
            <Dropdown
              className="print:hidden"
              dropdownLabel={
                <Icon
                  name="dotsThree"
                  weight="bold"
                  size="16"
                  aria-label={t("common.details_options")}
                />
              }
              dropdownItems={
                <>
                  <DropdownItem
                    icon="copy"
                    label={t("common.copy_id")}
                    onClick={() => {
                      void navigator.clipboard.writeText(resource?.id ?? "")
                    }}
                  />
                  {canUser("update", resource.type as ListableResourceType) && (
                    <DropdownItem
                      icon="pencilSimple"
                      label={t("common.edit_resource", {
                        resource: t("common.reference").toLowerCase(),
                      })}
                      onClick={() => {
                        show()
                      }}
                    />
                  )}
                </>
              }
            />
          }
        >
          <ListDetailsItem surface={surface} label="ID" gutter="none">
            <Text weight="medium" size="small">
              {resource?.id}
            </Text>
          </ListDetailsItem>
          <ListDetailsItem surface={surface} label="Reference" gutter="none">
            {reference === "" ? (
              <Text variant="disabled" size="small">
                &#8212;
              </Text>
            ) : (
              <Text weight="medium" size="small">
                {reference}
              </Text>
            )}
          </ListDetailsItem>
          <ListDetailsItem surface={surface} label="Updated" gutter="none">
            <Text weight="medium" size="small">
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
            <Text weight="medium" size="small">
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

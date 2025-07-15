import type { Address } from "@commercelayer/sdk"
import { useCallback } from "react"
import { useOverlay } from "#hooks/useOverlay"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { PageLayout } from "#ui/composite/PageLayout"
import type { ResourceAddressProps } from "./ResourceAddress"
import { ResourceAddressForm } from "./ResourceAddressForm"

type Props = Omit<ResourceAddressProps, "editable">

export const useResourceAddressOverlay = ({
  title,
  address,
  showBillingInfo,
  requiresBillingInfo,
  showNotes,
  onUpdate,
  onCreate,
}: Props) => {
  const { canUser } = useTokenProvider()
  const { Overlay, open, close } = useOverlay()

  const openAddressOverlay = useCallback(() => {
    if (canUser("update", "addresses")) {
      open()
    }
  }, [open, canUser])

  const ResourceAddressOverlay = useCallback(() => {
    return (
      canUser("update", "addresses") && (
        <Overlay>
          <PageLayout
            title={
              title ??
              `${address == null ? t("common.new") : t("common.edit")} ${t("resources.addresses.name").toLowerCase()}`
            }
            minHeight={false}
            navigationButton={{
              label: t("common.back"),
              onClick: () => {
                close()
              },
            }}
          >
            <ResourceAddressForm
              address={address}
              showBillingInfo={showBillingInfo}
              requiresBillingInfo={requiresBillingInfo}
              showNotes={showNotes}
              onUpdate={(updatedAddress: Address) => {
                onUpdate?.(updatedAddress)
                close()
              }}
              onCreate={(updatedAddress: Address) => {
                onCreate?.(updatedAddress)
                close()
              }}
            />
          </PageLayout>
        </Overlay>
      )
    )
  }, [
    Overlay,
    close,
    canUser,
    address,
    showBillingInfo,
    showNotes,
    onUpdate,
    onCreate,
  ])
  return { ResourceAddressOverlay, openAddressOverlay }
}

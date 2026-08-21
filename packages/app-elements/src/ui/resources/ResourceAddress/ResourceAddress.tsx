import type { Address as AddressType } from "@commercelayer/sdk"
import { useCallback, useEffect, useState } from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Address, type AddressProps } from "#ui/composite/Address"
import { useResourceAddressOverlay } from "./useResourceAddressOverlay"

export type ResourceAddressProps = Pick<
  AddressProps,
  "showBillingInfo" | "showNotes" | "title"
> & {
  /**
   * Resource of type `Address`
   */
  address?: AddressType | null
  /**
   * Optional setting to define if given address is editable (if set the Edit button and Overlay will be enabled).
   * Given the setting the component will also verify user abilities to ensure if he is enabled to update the
   * requested resource before to render editable related functionalities.
   */
  editable?: boolean
  /**
   * When set, the address can be deleted: the edit pencil becomes a `…` menu
   * holding both actions. The handler is called on click — the confirmation and
   * the delete itself belong to the caller, which knows what the address is
   * attached to.
   */
  onDelete?: () => void
  /**
   * Optional setting to define if given `Address` `billing_info` data is required.
   * @default false
   */
  requiresBillingInfo?: boolean
  /**
   * Get triggered as soon as the new address is created.
   */
  onCreate?: (createdAddress: AddressType) => void
  /**
   * Get triggered every time the address is updated.
   */
  onUpdate?: (updatedAddress: AddressType) => void
}

/**
 * Renders an all-in-one visualization and editing solution to deal with a given resource of type `Address`
 */
export const ResourceAddress = withSkeletonTemplate<ResourceAddressProps>(
  ({
    address,
    title,
    editable = false,
    onDelete,
    showBillingInfo = false,
    requiresBillingInfo = false,
    showNotes = true,
    onCreate,
    onUpdate,
  }) => {
    const [stateAddress, setStateAddress] = useState<
      AddressType | null | undefined
    >(address)
    const { canUser } = useTokenProvider()
    const canEdit = editable && canUser("update", "addresses")

    const handleOnUpdate = useCallback<
      NonNullable<ResourceAddressProps["onUpdate"]>
    >(
      (address) => {
        onUpdate?.(address)
        setStateAddress(address)
      },
      [onUpdate, setStateAddress],
    )

    const handleOnCreate = useCallback<
      NonNullable<ResourceAddressProps["onCreate"]>
    >(
      (address) => {
        onCreate?.(address)
        setStateAddress(address)
      },
      [onUpdate, setStateAddress],
    )

    const { ResourceAddressOverlay, openAddressOverlay } =
      useResourceAddressOverlay({
        address: stateAddress,
        showBillingInfo,
        requiresBillingInfo,
        showNotes,
        onCreate: handleOnCreate,
        onUpdate: handleOnUpdate,
      })

    useEffect(() => {
      setStateAddress(address)
    }, [address?.id])

    return (
      <>
        <Address
          address={stateAddress}
          title={title}
          showBillingInfo={showBillingInfo}
          showNotes={showNotes}
          onEdit={
            canEdit
              ? () => {
                  openAddressOverlay()
                }
              : undefined
          }
          onDelete={onDelete}
        />
        {canEdit && <ResourceAddressOverlay />}
      </>
    )
  },
)

ResourceAddress.displayName = "ResourceAddress"

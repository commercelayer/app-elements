import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { RemoveButton } from '#ui/atoms/RemoveButton'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { useState } from 'react'
import { type ResourceOrderSummaryProps } from './ResourceOrderSummary'

export const DeleteCouponButton = withSkeletonTemplate<
  Pick<ResourceOrderSummaryProps, 'onChange' | 'order'>
>(({ order, onChange }) => {
  const { sdkClient } = useCoreSdkProvider()
  const [isDeleting, setIsDeleting] = useState(false)
  return (
    <RemoveButton
      aria-label='Remove coupon'
      disabled={isDeleting}
      onClick={() => {
        setIsDeleting(true)
        void sdkClient.orders
          .update({
            id: order.id,
            coupon_code: null
          })
          .finally(() => {
            setIsDeleting(false)
            onChange?.()
          })
      }}
    />
  )
})

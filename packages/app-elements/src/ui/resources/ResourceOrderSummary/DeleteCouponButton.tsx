import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Trash } from '@phosphor-icons/react'
import { useState } from 'react'
import { type ResourceOrderSummaryProps } from './ResourceOrderSummary'

export const DeleteCouponButton = withSkeletonTemplate<
  Pick<ResourceOrderSummaryProps, 'onChange' | 'order'>
>(({ order, onChange }) => {
  const { sdkClient } = useCoreSdkProvider()
  const [isDeleting, setIsDeleting] = useState(false)
  return (
    <Button
      disabled={isDeleting}
      variant='link'
      className='block'
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
    >
      <Trash size={18} weight='bold' />
    </Button>
  )
})

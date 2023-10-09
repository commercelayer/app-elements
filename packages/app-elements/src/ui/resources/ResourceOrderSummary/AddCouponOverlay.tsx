import { useOverlay } from '#hooks/useOverlay'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { PageLayout } from '#ui/composite/PageLayout'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import type { Order } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAddCouponOverlay(order: Order, onChange?: () => void) {
  const { sdkClient } = useCoreSdkProvider()
  const { Overlay, open, close } = useOverlay()

  const validationSchema = useMemo(
    () =>
      z.object({
        couponCode: z
          .string({
            required_error: 'Please enter a valid coupon code.',
            invalid_type_error: 'Please enter a valid coupon code.'
          })
          .min(1, { message: 'Please enter a valid coupon code.' })
      }),
    []
  )

  const formMethods = useForm({
    defaultValues: {
      couponCode: null
    },
    resolver: zodResolver(validationSchema)
  })
  const {
    formState: { isSubmitting }
  } = formMethods

  return {
    close,
    open,
    Overlay: () => (
      <Overlay>
        <HookedForm
          {...formMethods}
          onSubmit={async (values) => {
            await sdkClient.orders
              .update({
                id: order.id,
                coupon_code: values.couponCode
              })
              .then(() => {
                onChange?.()
                formMethods.reset()
                close()
              })
              .finally(() => {
                formMethods.reset()
              })
          }}
        >
          <PageLayout
            title='Add coupon'
            onGoBack={() => {
              close()
            }}
          >
            <Spacer bottom='8'>
              <HookedInput
                disabled={isSubmitting}
                label='Coupon code'
                name='couponCode'
              />
            </Spacer>
            <Button type='submit' fullWidth disabled={isSubmitting}>
              Apply
            </Button>
          </PageLayout>
        </HookedForm>
      </Overlay>
    )
  }
}

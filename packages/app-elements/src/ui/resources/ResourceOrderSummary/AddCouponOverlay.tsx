import { useOverlay } from '#hooks/useOverlay'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { PageLayout } from '#ui/composite/PageLayout'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm/HookedValidationApiError'
import type { Order } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  order: Order
  onChange?: () => void
  close: () => void
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAddCouponOverlay(
  order: Props['order'],
  onChange?: Props['onChange']
) {
  const { Overlay, open, close } = useOverlay()

  return {
    close,
    open,
    Overlay: () => (
      <Overlay>
        <Form order={order} onChange={onChange} close={close} />
      </Overlay>
    )
  }
}

const Form: React.FC<Props> = ({ order, onChange, close }) => {
  const { sdkClient } = useCoreSdkProvider()
  const [apiError, setApiError] = useState<string>()

  const validationSchema = useMemo(
    () =>
      z.object({
        couponCode: z
          .string({
            required_error: 'Please enter a valid coupon code.',
            invalid_type_error: 'Please enter a valid coupon code.'
          })
          .min(8, {
            message: 'Coupon code is too short (minimum is 8 characters)'
          })
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

  return (
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
          .catch((error) => {
            setApiError(error)
          })
      }}
    >
      <PageLayout
        title='Add coupon'
        navigationButton={{
          label: 'Back',
          onClick: () => {
            close()
          }
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

        <Spacer top='4'>
          <HookedValidationApiError
            apiError={apiError}
            fieldMap={{
              coupon_code: 'couponCode'
            }}
          />
        </Spacer>
      </PageLayout>
    </HookedForm>
  )
}

import { useOverlay } from '#hooks/useOverlay'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { PageLayout } from '#ui/composite/PageLayout'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputCurrency } from '#ui/forms/InputCurrency'
import { type CurrencyCode } from '#ui/forms/InputCurrency/currencies'
import type { Order } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAdjustTotalOverlay(order: Order, onChange?: () => void) {
  const currencyCode = order.currency_code as Uppercase<CurrencyCode>
  const { sdkClient } = useCoreSdkProvider()
  const { Overlay, open, close } = useOverlay()

  const validationSchema = useMemo(
    () =>
      z.object({
        adjustTotal: z
          .number({
            required_error: 'Please enter a negative or positive value.',
            invalid_type_error: 'Please enter a negative or positive value.'
          })
          .superRefine((val, ctx) => {
            if (val === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please enter a negative or positive value.'
              })
            }
          })
      }),
    []
  )
  const formMethods = useForm({
    defaultValues: {
      adjustTotal: 0
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
            await sdkClient.adjustments
              .create({
                currency_code: currencyCode,
                amount_cents: values.adjustTotal,
                name: 'Manual adjustment'
              })
              .then(async (adjustment) => {
                return await sdkClient.line_items.create({
                  order: sdkClient.orders.relationship(order.id),
                  quantity: 1,
                  item: adjustment
                })
              })
              .then(() => {
                onChange?.()
                formMethods.reset()
                close()
              })
          }}
        >
          <PageLayout
            title='Adjust total'
            onGoBack={() => {
              close()
            }}
          >
            <Spacer bottom='8'>
              <HookedInputCurrency
                isClearable
                allowNegativeValue
                disabled={isSubmitting}
                currencyCode={currencyCode}
                label='Amount'
                name='adjustTotal'
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

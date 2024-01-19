import type { CurrencyCode } from '#helpers/currencies'
import { useOverlay } from '#hooks/useOverlay'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { PageLayout } from '#ui/composite/PageLayout'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputCurrency } from '#ui/forms/InputCurrency'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm/HookedValidationApiError'
import type { CommerceLayerClient, Order } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getManualAdjustment, manualAdjustmentReferenceOrigin } from './utils'

interface Props {
  order: Order
  onChange?: () => void
  close: () => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAdjustTotalOverlay(
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
  const currencyCode = order.currency_code as CurrencyCode
  const manualAdjustment = getManualAdjustment(order)
  const { sdkClient } = useCoreSdkProvider()
  const [apiError, setApiError] = useState<any>()

  const validationSchema = useMemo(
    () =>
      z.object({
        adjustTotal: z.number({
          required_error: 'The amount is required.',
          invalid_type_error: 'The amount is required.'
        })
      }),
    []
  )
  const formMethods = useForm({
    defaultValues: {
      adjustTotal: manualAdjustment?.total_amount_cents
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
        if (values.adjustTotal == null) {
          return
        }

        if (manualAdjustment == null) {
          await createManualAdjustmentLineItem({
            sdkClient,
            order,
            amount: values.adjustTotal
          })
            .then(() => {
              onChange?.()
              close()
            })
            .catch((error) => {
              setApiError(error)
            })
        } else {
          await updateManualAdjustmentLineItem({
            sdkClient,
            order,
            lineItemId: manualAdjustment.id,
            amount: values.adjustTotal
          })
            .then(() => {
              onChange?.()
              close()
            })
            .catch((error) => {
              setApiError(error)
            })
        }
      }}
    >
      <PageLayout
        title='Adjust total'
        navigationButton={{
          label: 'Back',
          onClick: () => {
            close()
          }
        }}
      >
        <Spacer bottom='8'>
          <HookedInputCurrency
            isClearable
            sign='-+'
            disabled={isSubmitting}
            currencyCode={currencyCode}
            label='Amount'
            name='adjustTotal'
          />
        </Spacer>
        <Button type='submit' fullWidth disabled={isSubmitting}>
          Apply
        </Button>

        <Spacer top='4'>
          <HookedValidationApiError apiError={apiError} />
        </Spacer>
      </PageLayout>
    </HookedForm>
  )
}

async function createManualAdjustmentLineItem({
  sdkClient,
  amount,
  order
}: {
  sdkClient: CommerceLayerClient
  amount: number
  order: Order
}): Promise<void> {
  if (amount !== 0) {
    const currencyCode = order.currency_code as CurrencyCode

    const adjustment = await sdkClient.adjustments.create({
      currency_code: currencyCode,
      amount_cents: amount,
      name: 'Manual adjustment',
      reference_origin: manualAdjustmentReferenceOrigin
    })

    await sdkClient.line_items.create({
      order: sdkClient.orders.relationship(order.id),
      quantity: 1,
      item: adjustment,
      reference_origin: manualAdjustmentReferenceOrigin
    })
  }
}

async function updateManualAdjustmentLineItem({
  sdkClient,
  amount,
  lineItemId,
  order
}: {
  sdkClient: CommerceLayerClient
  amount: number
  lineItemId: string
  order: Order
}): Promise<void> {
  const lineItem = await sdkClient.line_items.retrieve(lineItemId, {
    include: ['item']
  })

  if (lineItem.item != null) {
    if (amount === 0) {
      await sdkClient.adjustments.delete(lineItem.item.id)
      await sdkClient.line_items.delete(lineItemId)
    } else {
      const adjustment = await sdkClient.adjustments.update({
        id: lineItem.item.id,
        amount_cents: amount
      })

      await sdkClient.line_items.delete(lineItemId)
      await sdkClient.line_items.create({
        order: sdkClient.orders.relationship(order.id),
        quantity: 1,
        item: adjustment,
        reference_origin: manualAdjustmentReferenceOrigin
      })
    }
  }
}

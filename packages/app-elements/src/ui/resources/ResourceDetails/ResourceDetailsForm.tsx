import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm'
import { useForm } from 'react-hook-form'

import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { z } from 'zod'
import { type ResourceDetailsProps } from './ResourceDetails'

const metadataForm = z.object({
  reference: z.string().nullable(),
  reference_origin: z.string().nullable()
})

export const ResourceDetailsForm = withSkeletonTemplate<{
  resource: ResourceDetailsProps['resource']
  onUpdated: ResourceDetailsProps['onUpdated']
}>(({ resource, onUpdated }) => {
  const [apiError, setApiError] = useState<any>(undefined)
  const { sdkClient } = useCoreSdkProvider()

  const methods = useForm({
    defaultValues: {
      reference: resource.reference,
      reference_origin: resource.reference_origin
    },
    resolver: zodResolver(metadataForm)
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(formValues) => {
        void sdkClient[resource.type]
          .update({
            id: resource.id,
            reference: formValues.reference,
            reference_origin: formValues.reference_origin
          })
          .then(() => {
            void onUpdated()
          })
          .catch((error) => {
            setApiError(error)
          })
      }}
    >
      <Spacer bottom='12'>
        <Spacer bottom='8'>
          <HookedInput name='reference' label='Reference' />
        </Spacer>
        <Spacer bottom='8'>
          <HookedInput name='reference_origin' label='Reference origin' />
        </Spacer>
      </Spacer>
      <Button
        type='submit'
        disabled={methods.formState.isSubmitting}
        className='w-full'
      >
        Update
      </Button>
      <Spacer top='2'>
        <HookedValidationApiError apiError={apiError} />
      </Spacer>
    </HookedForm>
  )
})

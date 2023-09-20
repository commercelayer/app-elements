import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm'
import { useForm, type UseFormSetError } from 'react-hook-form'

import { Button } from '#ui/atoms/Button'
import { Section } from '#ui/atoms/Section'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { humanizeString } from '#utils/text'
import { type Metadata } from '@commercelayer/sdk/lib/cjs/resource'

interface ResourceMetadataFormValues {
  metadata: Metadata
}

export const ResourceMetadataForm = withSkeletonTemplate<{
  defaultValues: ResourceMetadataFormValues
  onSubmit: (
    formValues: ResourceMetadataFormValues,
    setError: UseFormSetError<ResourceMetadataFormValues>
  ) => void
  isSubmitting: boolean
  apiError?: any
}>(({ defaultValues, onSubmit, isSubmitting, apiError }) => {
  const methods = useForm({
    defaultValues
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(formValues) => {
        onSubmit(formValues, methods.setError)
      }}
    >
      <Spacer bottom='12'>
        <Section title='Metadata'>
          {Object.entries(methods.watch('metadata')).map(
            ([metadataKey, metadataValue], idx) => {
              const label = humanizeString(metadataKey)
              if (typeof metadataValue !== 'string') return <></>
              return (
                <ListItem tag='div' key={idx}>
                  <Text variant='info'>{label}</Text>
                  <HookedInput name={`metadata.${metadataKey}`} />
                </ListItem>
              )
            }
          )}
        </Section>
      </Spacer>
      <Button type='submit' disabled={isSubmitting} className='w-full'>
        Update
      </Button>
      <HookedValidationApiError apiError={apiError} />
    </HookedForm>
  )
})

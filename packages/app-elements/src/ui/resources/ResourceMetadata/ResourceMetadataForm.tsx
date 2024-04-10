import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { HookedForm } from '#ui/forms/Form'
import { HookedInput } from '#ui/forms/Input'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm'
import { useForm } from 'react-hook-form'

import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { humanizeString } from '#utils/text'
import { type Metadata } from '@commercelayer/sdk/lib/cjs/resource'
import { useMemo } from 'react'
import { type ResourceMetadataProps } from './ResourceMetadata'

interface ResourceMetadataFormValues {
  metadata: Metadata
}

export const ResourceMetadataForm = withSkeletonTemplate<{
  resourceId: string
  defaultValues: ResourceMetadataFormValues
  mode: ResourceMetadataProps['mode']
  onSubmit: (formValues: ResourceMetadataFormValues) => void
  isSubmitting: boolean
  apiError?: any
}>(({ resourceId, defaultValues, mode, onSubmit, isSubmitting, apiError }) => {
  const keyedMetadata: KeyedMetadata[] = useMemo(() => {
    const result = Object.entries(defaultValues.metadata).map(
      ([metadataKey, metadataValue]) => ({
        key: metadataKey,
        value: metadataValue
      })
    )

    if (mode === 'advanced' && result.length === 0) {
      result.push({
        key: '',
        value: ''
      })
    }

    return result
  }, [defaultValues.metadata, mode])

  const methods = useForm({
    defaultValues: { metadata: keyedMetadata }
  })

  const watchedMetadata = methods.watch('metadata')

  const addNewRow = (): void => {
    watchedMetadata.push({
      key: '',
      value: ''
    })
    methods.setValue('metadata', watchedMetadata)
    setTimeout(() => {
      methods.setFocus(`metadata.${watchedMetadata.length - 1}.key`, {
        shouldSelect: true
      })
    }, 200)
  }

  return (
    <HookedForm
      {...methods}
      onSubmit={(formValues) => {
        const sdkMetadata: Metadata = {}
        formValues.metadata?.forEach((m) => {
          sdkMetadata[m.key] = m.value
        })
        onSubmit({ metadata: sdkMetadata })
      }}
    >
      <Spacer bottom='12'>
        <Section title='Metadata'>
          {watchedMetadata.map((metadata, idx) => {
            const label = humanizeString(metadata.key)
            if (typeof metadata.value !== 'string') return <></>
            return (
              <ListItem key={`metadata.${idx}`} alignItems='center' padding='y'>
                <div className='flex items-center justify-between gap-4'>
                  {mode === 'simple' ? (
                    <Text variant='info'>{label}</Text>
                  ) : (
                    <HookedInput name={`metadata.${idx}.key`} />
                  )}
                  <div className='md:w-3/5'>
                    <HookedInput name={`metadata.${idx}.value`} />
                  </div>
                </div>
                {mode === 'advanced' && (
                  <button
                    aria-label='Remove'
                    type='button'
                    className='rounded'
                    onClick={() => {
                      watchedMetadata.splice(idx, 1)
                      methods.setValue('metadata', watchedMetadata)
                    }}
                  >
                    <Icon name='minus' size={24} />
                  </button>
                )}
              </ListItem>
            )
          })}
          {mode === 'advanced' && (
            <Spacer top='4'>
              <Button
                variant='secondary'
                type='button'
                onClick={() => {
                  addNewRow()
                }}
                size='small'
                alignItems='center'
              >
                <Icon name='plus' /> Add another
              </Button>
            </Spacer>
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

interface KeyedMetadata {
  key: string
  value: string
}

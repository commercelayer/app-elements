import { formatResourceName } from '#helpers/resources'
import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import {
  InputSelect,
  type InputSelectProps,
  type InputSelectValue
} from '#ui/forms/InputSelect'
import {
  type CommerceLayerClient,
  type ListableResourceType,
  type ListResponse
} from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useEffect, useState } from 'react'

type ListResource<TResource extends ListableResourceType> = Awaited<
  ReturnType<CommerceLayerClient[TResource]['list']>
>
type Resource<TResource extends ListableResourceType> =
  ListResource<TResource>[number]

interface InputResourceSelectProps<TResource extends ListableResourceType>
  extends Omit<InputSelectProps, 'onSelect' | 'initialValues'> {
  type: TResource
  onSelect: (resource: Resource<TResource> | null) => void
  fieldForLabel: keyof Resource<TResource> extends string
    ? keyof Resource<TResource>
    : never
  initialValues: InputSelectValue[]
}

export function InputResourceSelect<TResource extends ListableResourceType>({
  name,
  fieldForLabel,
  type,
  onSelect,
  initialValues
}: InputResourceSelectProps<TResource>): JSX.Element {
  const { sdkClient } = useCoreSdkProvider()
  const [isLoading, setIsLoading] = useState(true)
  const [_initialValues, setInitialValues] = useState<InputSelectValue[]>([])
  // if there are more than 25 resources, we need use an an async select by using loadAsyncValues prop
  const [isAsyncRequired, setIsAsyncRequired] = useState(false)

  const fetchResources = useCallback(
    async (hint?: string) => {
      const resources = (await sdkClient[type].list({
        pageSize: 25,
        ...(isEmpty(hint)
          ? {}
          : {
              filters: { [`${fieldForLabel}_cont`]: hint ?? '' }
            })
      })) as ListResponse<Resource<TResource>>

      if (resources.meta.pageCount > 1) {
        setIsAsyncRequired(true)
      }

      const options = resources.map((resources) => ({
        label: resources[fieldForLabel],
        value: resources.id,
        meta: resources
      })) as InputSelectValue[]

      return [...initialValues, ...options]
    },
    [type, initialValues]
  )

  useEffect(function fetchInitialValues() {
    setIsLoading(true)
    void fetchResources()
      .then((values) => {
        setInitialValues(values)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const defaultValue = _initialValues.length > 0 ? _initialValues[0] : undefined
  useEffect(
    function preselectFirstValue() {
      if (defaultValue != null) {
        onSelect(defaultValue.meta as Resource<TResource>)
      }
    },
    [defaultValue]
  )

  const noOptionsFound = _initialValues.length === 0 && !isLoading
  const placeholder = noOptionsFound
    ? `No ${formatResourceName({
        resource: type,
        count: 'plural'
      })} found`
    : isAsyncRequired
      ? 'Type to search...'
      : 'Select a resource'

  return (
    <InputSelect
      name={name}
      isLoading={isLoading}
      isDisabled={noOptionsFound}
      initialValues={_initialValues}
      key={defaultValue?.value}
      defaultValue={defaultValue}
      isMulti
      isSearchable={isAsyncRequired}
      placeholder={placeholder}
      loadAsyncValues={isAsyncRequired ? fetchResources : undefined}
      onSelect={(resource) => {
        onSelect(
          resource != null && 'meta' in resource
            ? (resource.meta as Resource<TResource>)
            : null
        )
      }}
    />
  )
}

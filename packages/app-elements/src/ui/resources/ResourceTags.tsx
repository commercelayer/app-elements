import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Overlay } from '#ui/atoms/Overlay'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Tag as TagUi } from '#ui/atoms/Tag'
import { Text } from '#ui/atoms/Text'
import { OverlayLayout } from '#ui/composite/OverlayLayout'
import {
  InputSelect,
  isMultiValueSelected,
  type SelectValue
} from '#ui/forms/InputSelect'
import { type Tag } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import type { QueryParamsList } from '@commercelayer/sdk/lib/cjs/query'
import { type ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import { Tag as TagIcon } from '@phosphor-icons/react'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useState } from 'react'

type TaggableResource = Extract<
  ListableResourceType,
  | 'addresses'
  | 'bundles'
  | 'customers'
  | 'coupons'
  | 'gift_cards'
  | 'line_items'
  | 'orders'
  | 'returns'
  | 'sku_options'
  | 'skus'
>

interface TagsOverlay {
  title: string
  description?: string
}

export const ResourceTags = withSkeletonTemplate<{
  resourceType: TaggableResource
  resourceId: string
  overlay: TagsOverlay
}>(({ resourceType, resourceId, overlay }) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedTagsLimitReached, setSelectedTagsLimitReached] =
    useState(false)

  const { data: resourceTags, mutate: mutateResourceTags } = useCoreApi(
    resourceType,
    'tags',
    resourceId == null || isEmpty(resourceId)
      ? null
      : [
          resourceId,
          {
            fields: ['id', 'name']
          }
        ]
  )

  const { data: organizationTags } = useCoreApi('tags', 'list', [
    {
      fields: ['id', 'name'],
      sort: ['updated_at'],
      pageSize: 10
    }
  ])
  const { sdkClient } = useCoreSdkProvider()

  const tagsToSelectOptions = useCallback(
    (tags: Tag[]): SelectValue[] =>
      tags.map((item) => ({
        value: item.id,
        label: `${item.name}`,
        meta: item
      })),
    []
  )

  const selectedOptionsToTags = useCallback(
    (selectedOptions: SelectValue[]): Tag[] => {
      if (selectedOptions.length > 0) {
        return selectedOptions.map((item) => item.meta as Tag)
      }
      // We need to set this particular empty value because at the moment SDK expects always at least an empty tag object while updating the relationship
      return [{ id: null, type: 'tags' } as unknown as Tag]
    },
    []
  )

  const [selectedTags, setSelectedTags] = useState(
    tagsToSelectOptions(resourceTags ?? [])
  )

  if (resourceTags == null || organizationTags == null) return <></>

  return (
    <div>
      <div className='flex flex-wrap gap-2'>
        {resourceTags.map((tag, idx) => (
          <TagUi tag='div' key={idx}>
            {tag.name}
          </TagUi>
        ))}
        <TagUi
          tag='a'
          icon={<TagIcon weight='bold' />}
          href='#'
          onClick={(e) => {
            e.preventDefault()
            setShowOverlay(true)
          }}
        >
          Tags
        </TagUi>
      </div>
      {showOverlay && (
        <Overlay
          button={{
            label: 'Update',
            onClick: () => {
              void sdkClient[resourceType]
                .update(
                  {
                    id: resourceId,
                    tags: selectedOptionsToTags(selectedTags)
                  },
                  {
                    include: ['tags']
                  }
                )
                .then((updatedResource) => {
                  const newTags = updatedResource.tags ?? []
                  void mutateResourceTags(newTags as ListResponse<Tag>, {
                    revalidate: false
                  }).then(() => {
                    setShowOverlay(false)
                  })
                })
            }
          }}
        >
          <OverlayLayout
            title={overlay.title}
            description={overlay.description}
            onGoBack={() => {
              setShowOverlay(false)
            }}
          >
            <InputSelect
              label='Tags'
              placeholder='Search...'
              hint={{
                text: (
                  <>
                    You can add up to 10 tags.
                    {selectedTagsLimitReached && (
                      <>
                        {' '}
                        <Text weight='bold' variant='warning'>
                          Limit reached
                        </Text>
                        .
                      </>
                    )}
                  </>
                )
              }}
              isMulti
              isSearchable
              isClearable={false}
              isOptionDisabled={() => selectedTags.length >= 10}
              loadAsyncValues={async (hint) => {
                return await sdkClient.tags
                  .list(makeTagQuery(hint))
                  .then(tagsToSelectOptions)
              }}
              initialValues={tagsToSelectOptions(organizationTags)}
              defaultValue={tagsToSelectOptions(resourceTags)}
              onSelect={(selectedTags) => {
                if (isMultiValueSelected(selectedTags)) {
                  setSelectedTagsLimitReached(selectedTags.length >= 10)
                  setSelectedTags(selectedTags)
                  return
                }
                setSelectedTags([])
              }}
            />
          </OverlayLayout>
        </Overlay>
      )}
    </div>
  )
})

/**
 * Generate a valid SDK query object to retrieve the available tags with hint to filter by name
 */
function makeTagQuery(hint: string): QueryParamsList {
  return {
    fields: ['id', 'name'],
    filters: {
      ...(!isEmpty(hint) && { name_cont: hint })
    },
    pageSize: 25
  }
}

ResourceTags.displayName = 'ResourceTags'

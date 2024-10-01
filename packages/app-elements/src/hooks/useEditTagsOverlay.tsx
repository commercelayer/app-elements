import { navigateTo } from '#helpers/appsNavigation'
import { useOverlay } from '#hooks/useOverlay'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import {
  InputSelect,
  type InputSelectValue,
  isMultiValueSelected
} from '#ui/forms/InputSelect'
import { type ResourceTagsProps } from '#ui/resources/ResourceTags'
import { type ListResponse, type Tag } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useState } from 'react'

export interface EditTagsOverlayProps {
  /**
   * Title shown as first line in edit overlay heading
   */
  title: string
  /**
   * Optional description shown as second line in edit overlay heading
   */
  description?: string
  /**
   * Optional setting to define if tags app management link is to be shown in edit overlay heading
   */
  showManageAction?: boolean
  resourceId: ResourceTagsProps['resourceId']
  resourceType: ResourceTagsProps['resourceType']
}

interface TagsOverlayHook {
  show: () => void
  Overlay: React.FC<EditTagsOverlayProps>
}

export function useEditTagsOverlay(): TagsOverlayHook {
  const {
    Overlay: OverlayElement,
    open,
    close
  } = useOverlay({ queryParam: 'edit-tags' })

  const { settings } = useTokenProvider()

  const [selectedTagsLimitReached, setSelectedTagsLimitReached] =
    useState(false)

  const navigateToTagsManagement = navigateTo({
    destination: {
      app: 'tags',
      mode: settings.mode
    }
  })

  return {
    show: open,
    Overlay: ({
      title,
      description,
      showManageAction,
      resourceId,
      resourceType
    }) => {
      const { sdkClient } = useCoreSdkProvider()

      const {
        data: resourceTags,
        isLoading,
        mutate: mutateResourceTags
      } = useCoreApi(
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

      const tagsToSelectOptions = useCallback(
        (tags: Tag[]): InputSelectValue[] =>
          tags.map((item) => ({
            value: item.id,
            label: `${item.name}`,
            meta: item
          })),
        []
      )

      const selectedOptionsToTags = useCallback(
        (selectedOptions: InputSelectValue[]): Tag[] => {
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

      if (isLoading || resourceTags == null) return <></>

      return (
        <OverlayElement
          footer={
            <Button
              type='button'
              fullWidth
              onClick={() => {
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
                      close()
                    })
                  })
              }}
            >
              Update
            </Button>
          }
        >
          <PageLayout
            title={title}
            description={description}
            minHeight={false}
            navigationButton={{
              label: 'Close',
              icon: 'x',
              onClick: () => {
                close()
              }
            }}
            toolbar={{
              buttons:
                showManageAction != null && showManageAction
                  ? [
                      {
                        label: 'Manage tags',
                        variant: 'secondary',
                        size: 'small',
                        onClick: navigateToTagsManagement?.onClick
                      }
                    ]
                  : []
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
                if (hint.length > 0) {
                  return await sdkClient.tags
                    .list({
                      fields: ['id', 'name'],
                      filters: {
                        ...(!isEmpty(hint) && { name_cont: hint })
                      },
                      pageSize: 25
                    })
                    .then(tagsToSelectOptions)
                }
                return []
              }}
              initialValues={[]}
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
          </PageLayout>
        </OverlayElement>
      )
    }
  }
}

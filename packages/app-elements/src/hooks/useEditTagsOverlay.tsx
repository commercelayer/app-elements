import type { ListResponse, Tag } from "@commercelayer/sdk"
import isEmpty from "lodash-es/isEmpty"
import { useCallback, useState } from "react"
import { navigateTo } from "#helpers/appsNavigation"
import { useOverlay } from "#hooks/useOverlay"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { useTranslation } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button, type ButtonProps } from "#ui/atoms/Button"
import { Text } from "#ui/atoms/Text"
import { PageLayout } from "#ui/composite/PageLayout"
import {
  InputSelect,
  type InputSelectValue,
  isMultiValueSelected,
} from "#ui/forms/InputSelect"
import type { ResourceTagsProps } from "#ui/resources/ResourceTags"

export interface EditTagsOverlayProps {
  /**
   * Optional title shown as first line in edit overlay heading
   */
  title?: string
  /**
   * Optional setting to define if tags app management link is to be shown in edit overlay heading
   */
  showManageAction?: boolean
  resourceId: ResourceTagsProps["resourceId"]
  resourceType: ResourceTagsProps["resourceType"]
}

interface TagsOverlayHook {
  show: () => void
  Overlay: React.FC<EditTagsOverlayProps>
}

export function useEditTagsOverlay(): TagsOverlayHook {
  const {
    Overlay: OverlayElement,
    open,
    close,
  } = useOverlay({ queryParam: "edit-tags" })

  const { settings } = useTokenProvider()
  const { t } = useTranslation()

  const [selectedTagsLimitReached, setSelectedTagsLimitReached] =
    useState(false)

  const navigateToTagsManagement = navigateTo({
    destination: {
      app: "tags",
      mode: settings.mode,
    },
  })

  const resourceName = t("resources.tags.name_other")

  return {
    show: open,
    Overlay: ({
      title = "Back",
      showManageAction = false,
      resourceId,
      resourceType,
    }) => {
      const { sdkClient } = useCoreSdkProvider()

      const { data: organization, isLoading: isOrganizationLoading } =
        useCoreApi("organization", "retrieve", [])

      const {
        data: resourceTags,
        isLoading,
        mutate: mutateResourceTags,
      } = useCoreApi(
        resourceType,
        "tags",
        resourceId == null || isEmpty(resourceId)
          ? null
          : [
              resourceId,
              {
                fields: ["id", "name"],
                pageSize: 25,
              },
            ],
      )

      const tagsToSelectOptions = useCallback(
        (tags: Tag[]): InputSelectValue[] =>
          tags.map((item) => ({
            value: item.id,
            label: `${item.name}`,
            meta: item,
          })),
        [],
      )

      const selectedOptionsToTags = useCallback(
        (selectedOptions: InputSelectValue[]): Tag[] => {
          if (selectedOptions.length > 0) {
            return selectedOptions.map((item) => item.meta as Tag)
          }
          // We need to set this particular empty value because at the moment SDK expects always at least an empty tag object while updating the relationship
          return [{ id: null, type: "tags" } as unknown as Tag]
        },
        [],
      )

      const [selectedTags, setSelectedTags] = useState(
        tagsToSelectOptions(resourceTags ?? []),
      )

      if (isLoading || isOrganizationLoading || resourceTags == null) {
        return null
      }

      const maxAllowedTags = organization?.tags_max_allowed_number ?? 10

      return (
        <OverlayElement
          footer={
            <Button
              type="button"
              fullWidth
              onClick={() => {
                void sdkClient[resourceType]
                  .update(
                    {
                      id: resourceId,
                      tags: selectedOptionsToTags(selectedTags),
                    },
                    {
                      include: ["tags"],
                    },
                  )
                  .then((updatedResource) => {
                    const newTags = updatedResource.tags ?? []
                    void mutateResourceTags(newTags as ListResponse<Tag>, {
                      revalidate: false,
                    }).then(() => {
                      close()
                    })
                  })
              }}
            >
              {t("common.update")}
            </Button>
          }
        >
          <PageLayout
            title={t("common.edit", { resource: resourceName.toLowerCase() })}
            minHeight={false}
            navigationButton={{
              label: title,
              icon: "arrowLeft",
              onClick: () => {
                close()
              },
            }}
            toolbar={{
              buttons:
                showManageAction != null && showManageAction
                  ? [
                      {
                        label: t("common.manage_resource", {
                          resource: resourceName.toLowerCase(),
                        }),
                        variant: "secondary",
                        size: "small",
                        onClick:
                          navigateToTagsManagement?.onClick as ButtonProps["onClick"],
                      },
                    ]
                  : [],
            }}
          >
            <InputSelect
              label={resourceName}
              placeholder={t("common.search")}
              hint={{
                text: (
                  <>
                    {t("common.add_up_to", {
                      limit: maxAllowedTags,
                      resource: resourceName.toLowerCase(),
                    })}
                    {selectedTagsLimitReached && (
                      <>
                        {" "}
                        <Text weight="bold" variant="warning">
                          {t("common.limit_reached")}
                        </Text>
                        .
                      </>
                    )}
                  </>
                ),
              }}
              isMulti
              isSearchable
              isClearable={false}
              isOptionDisabled={() => selectedTags.length >= maxAllowedTags}
              loadAsyncValues={async (hint) => {
                if (hint.length > 0) {
                  return await sdkClient.tags
                    .list({
                      fields: ["id", "name"],
                      filters: {
                        ...(!isEmpty(hint) && { name_cont: hint }),
                      },
                      pageSize: 25,
                    })
                    .then(tagsToSelectOptions)
                }
                return []
              }}
              initialValues={[]}
              defaultValue={tagsToSelectOptions(resourceTags)}
              onSelect={(selectedTags) => {
                if (isMultiValueSelected(selectedTags)) {
                  setSelectedTagsLimitReached(
                    selectedTags.length >= maxAllowedTags,
                  )
                  setSelectedTags(selectedTags)
                  return
                }
                setSelectedTags([])
              }}
            />
          </PageLayout>
        </OverlayElement>
      )
    },
  }
}

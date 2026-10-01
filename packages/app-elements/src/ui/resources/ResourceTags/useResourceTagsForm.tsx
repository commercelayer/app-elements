import type { ListResponse, Tag } from "@commercelayer/sdk"
import isEmpty from "lodash-es/isEmpty"
import { type ReactNode, useCallback, useEffect, useState } from "react"
import { navigateTo } from "#helpers/appsNavigation"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { useTranslation } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Text } from "#ui/atoms/Text"
import {
  InputSelect,
  type InputSelectValue,
  isMultiValueSelected,
} from "#ui/forms/InputSelect"
import type { ResourceTagsProps } from "./ResourceTags"

export interface UseResourceTagsFormProps {
  resourceId: ResourceTagsProps["resourceId"]
  resourceType: ResourceTagsProps["resourceType"]
  /**
   * Whether the form is currently visible. The selection starts over whenever this
   * flips to `true`, so a container that keeps it mounted across openings still
   * shows the tags as they are now rather than what was last picked.
   */
  isOpen?: boolean
  /**
   * Where the autocomplete panel is attached in the DOM.
   *
   * Left out, the panel renders inside the field, so a container that clips or
   * scrolls — a modal body — cuts it off. Pointed at an element that does not
   * clip, the panel escapes the container while staying anchored to the field.
   */
  menuPortalTarget?: HTMLElement | null
  /**
   * Whether the link to the tags app is shown beside the submit button.
   * @default false
   */
  showManageAction?: boolean
  /** Called once the resource has been updated */
  onSubmitted?: () => void
  /**
   * Called when the user gives up on the edit. Leaving it out drops the cancel
   * control, for a container that has a way out of its own.
   */
  onCancel?: () => void
}

interface ResourceTagsFormHook {
  /** Submit handler for the `<form>` hosting the fields (e.g. `Modal`'s `onSubmit`) */
  onSubmit: React.FormEventHandler<HTMLFormElement>
  /** The tags selection, to be rendered in the scrollable area */
  fields: ReactNode
  /**
   * The controls that stay put while the field scrolls — manage, cancel,
   * submit. To be rendered in the pinned area.
   */
  footer: ReactNode
}

const tagsToSelectOptions = (tags: Tag[]): InputSelectValue[] =>
  tags.map((item) => ({
    value: item.id,
    label: `${item.name}`,
    meta: item,
  }))

const selectedOptionsToTags = (selectedOptions: InputSelectValue[]): Tag[] => {
  if (selectedOptions.length > 0) {
    return selectedOptions.map((item) => item.meta as Tag)
  }
  // We need to set this particular empty value because at the moment SDK expects always at least an empty tag object while updating the relationship
  return [{ id: null, type: "tags" } as unknown as Tag]
}

/**
 * Builds the pieces of a `tags` update form, leaving their placement to the
 * caller: `fields` and `footer` can go in separate containers — such as a
 * `Modal`'s `Body` and `Footer` — as long as the enclosing `<form>` is given
 * `onSubmit`.
 */
export function useResourceTagsForm({
  resourceId,
  resourceType,
  isOpen = true,
  menuPortalTarget,
  showManageAction = false,
  onSubmitted,
  onCancel,
}: UseResourceTagsFormProps): ResourceTagsFormHook {
  const { settings } = useTokenProvider()
  const { t } = useTranslation()
  const { sdkClient } = useCoreSdkProvider()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<InputSelectValue[]>([])
  const [selectedTagsLimitReached, setSelectedTagsLimitReached] =
    useState(false)

  const resourceName = t("resources.tags.name_other")

  const navigateToTagsManagement = navigateTo({
    destination: {
      app: "tags",
      mode: settings.mode,
    },
  })

  const { data: organization, isLoading: isOrganizationLoading } = useCoreApi(
    "organization",
    "retrieve",
    [],
  )

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

  const maxAllowedTags = organization?.tags_max_allowed_number ?? 10

  // The tags are fetched while the form is already mounted, so the selection is
  // filled in here rather than by the initial state alone.
  useEffect(() => {
    if (isOpen) {
      const currentTags = tagsToSelectOptions(resourceTags ?? [])
      setSelectedTags(currentTags)
      setSelectedTagsLimitReached(currentTags.length >= maxAllowedTags)
    }
  }, [isOpen, resourceTags, maxAllowedTags])

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault()
      setIsSubmitting(true)

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
        .then(async (updatedResource) => {
          const newTags = updatedResource.tags ?? []
          await mutateResourceTags(newTags as ListResponse<Tag>, {
            revalidate: false,
          })
          onSubmitted?.()
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [
      sdkClient,
      resourceType,
      resourceId,
      selectedTags,
      mutateResourceTags,
      onSubmitted,
    ],
  )

  return {
    onSubmit: handleSubmit,
    fields: (
      <InputSelect
        label={resourceName}
        placeholder={t("common.search")}
        isLoading={isLoading || isOrganizationLoading}
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
        menuPortalTarget={menuPortalTarget}
        isClearable={false}
        isOptionDisabled={() => selectedTags.length >= maxAllowedTags}
        loadAsyncValues={async (hint) => {
          if (hint.length > 0) {
            return await sdkClient.tags
              .list({
                fields: ["id", "name"],
                filters: {
                  ...(!isEmpty(hint) && { name_i_cont: hint }),
                },
                pageSize: 25,
              })
              .then(tagsToSelectOptions)
          }
          return []
        }}
        initialValues={[]}
        value={selectedTags}
        onSelect={(selectedTags) => {
          if (isMultiValueSelected(selectedTags)) {
            setSelectedTagsLimitReached(selectedTags.length >= maxAllowedTags)
            setSelectedTags([...selectedTags])
            return
          }
          setSelectedTags([])
        }}
      />
    ),
    footer: (
      <div className="flex items-center justify-between gap-4">
        {showManageAction && navigateToTagsManagement != null ? (
          <Button
            variant="secondary"
            type="button"
            size="small"
            onClick={navigateToTagsManagement.onClick}
          >
            {t("common.manage_resource", {
              resource: resourceName.toLowerCase(),
            })}
          </Button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {onCancel != null && (
            <Button
              variant="secondary"
              type="button"
              size="small"
              onClick={onCancel}
            >
              {t("common.cancel")}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} size="small">
            {`${t("common.update")} ${resourceName.toLowerCase()}`}
          </Button>
        </div>
      </div>
    ),
  }
}

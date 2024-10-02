import {
  type EditTagsOverlayProps,
  useEditTagsOverlay
} from '#hooks/useEditTagsOverlay'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Tag as TagUi } from '#ui/atoms/Tag'
import { Text } from '#ui/atoms/Text'
import type { ListableResourceType } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'

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
  | 'shipments'
>

interface TagsOverlay
  extends Omit<EditTagsOverlayProps, 'resourceId' | 'resourceType'> {}

export interface ResourceTagsProps {
  resourceType: TaggableResource
  resourceId: string
  /**
   * Edit overlay configuration
   */
  overlay: TagsOverlay
  /**
   * Optional onTagClick function to define the click behavior of single tag in visualization
   */
  onTagClick?: (tagId: string) => void
}

/**
 * This component generates an all-in-one visualization and editing interface for managing tags relationship of requested resource.
 */
export const ResourceTags = withSkeletonTemplate<ResourceTagsProps>(
  ({ resourceType, resourceId, overlay, onTagClick }) => {
    const { data: resourceTags } = useCoreApi(
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

    const { Overlay: EditTagsOverlay, show } = useEditTagsOverlay()

    const { canUser } = useTokenProvider()

    return (
      <Section
        title='Tags'
        actionButton={
          canUser('update', 'tags') && (
            <Button
              variant='secondary'
              size='mini'
              alignItems='center'
              aria-label='Edit tags'
              onClick={(e) => {
                e.preventDefault()
                show()
              }}
            >
              <Icon name='pencilSimple' size='16' />
              Edit
            </Button>
          )
        }
      >
        {resourceTags == null ? (
          <Spacer top='4'>
            <Text variant='info'>No tags.</Text>
          </Spacer>
        ) : (
          <div className='flex flex-wrap gap-2 mt-4'>
            {resourceTags.map((tag, idx) => {
              if (onTagClick != null) {
                return (
                  <TagUi
                    key={idx}
                    onClick={() => {
                      onTagClick(tag.id)
                    }}
                  >
                    {tag.name}
                  </TagUi>
                )
              }
              return <TagUi key={idx}>{tag.name}</TagUi>
            })}
          </div>
        )}
        <EditTagsOverlay
          resourceId={resourceId}
          resourceType={resourceType}
          title={overlay.title}
          showManageAction={overlay.showManageAction}
        />
      </Section>
    )
  }
)

ResourceTags.displayName = 'ResourceTags'

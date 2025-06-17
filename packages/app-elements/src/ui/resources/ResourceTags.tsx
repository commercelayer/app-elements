import { isMockedId } from '#helpers/mocks'
import {
  type EditTagsOverlayProps,
  useEditTagsOverlay
} from '#hooks/useEditTagsOverlay'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { t } from '#providers/I18NProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Tag as TagUi } from '#ui/atoms/Tag'
import { Text } from '#ui/atoms/Text'
import type { ListableResourceType } from '@commercelayer/sdk'
import isEmpty from 'lodash-es/isEmpty'

type TaggableResource = Extract<
  ListableResourceType,
  | 'addresses'
  | 'bundles'
  | 'coupons'
  | 'customers'
  | 'gift_cards'
  | 'line_items'
  | 'line_item_options'
  | 'order_subscriptions'
  | 'orders'
  | 'buy_x_pay_y_promotions'
  | 'external_promotions'
  | 'fixed_amount_promotions'
  | 'fixed_price_promotions'
  | 'flex_promotions'
  | 'free_gift_promotions'
  | 'free_shipping_promotions'
  | 'percentage_discount_promotions'
  | 'returns'
  | 'shipments'
  | 'sku_options'
  | 'skus'
>

interface TagsOverlay
  extends Omit<EditTagsOverlayProps, 'resourceId' | 'resourceType'> {}

export interface ResourceTagsProps {
  resourceType: TaggableResource
  resourceId: string
  /**
   * Edit overlay configuration
   */
  overlay?: TagsOverlay
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
      resourceId == null || isEmpty(resourceId) || isMockedId(resourceId)
        ? null
        : [
            resourceId,
            {
              fields: ['id', 'name'],
              pageSize: 25
            }
          ]
    )

    const { Overlay: EditTagsOverlay, show } = useEditTagsOverlay()

    const { canUser } = useTokenProvider()

    return (
      <Section
        title='Tags'
        actionButton={
          canUser('update', resourceType) && (
            <Button
              variant='secondary'
              size='mini'
              alignItems='center'
              aria-label={t('common.edit_resource', {
                resource: t('resources.tags.name').toLowerCase()
              })}
              onClick={(e) => {
                e.preventDefault()
                show()
              }}
            >
              <Icon name='pencilSimple' size='16' />
              {t('common.edit')}
            </Button>
          )
        }
      >
        {resourceTags == null || resourceTags.length === 0 ? (
          <Spacer top='4'>
            <Text variant='info'>{t('common.no_resources.no_tags')}.</Text>
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
          title={overlay?.title}
          showManageAction={overlay?.showManageAction}
        />
      </Section>
    )
  }
)

ResourceTags.displayName = 'ResourceTags'

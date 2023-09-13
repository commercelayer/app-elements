import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { humanizeString } from '#utils/text'
import type { Metadata } from '@commercelayer/sdk/lib/cjs/resource'

export const ResourceListItemsMetadata = withSkeletonTemplate<{
  metadata?: Metadata
}>(({ metadata }) => {
  if (metadata == null || Object.keys(metadata).length === 0) return <></>

  return (
    <>
      {Object.entries(metadata).map(([metadataKey, metadataValue], idx) => {
        if (typeof metadataValue !== 'string') return null

        return (
          <ListItem
            tag='div'
            key={idx}
            data-testid={`ListItemsMetadata-item-${metadataKey}`}
          >
            <Text variant='info'>{humanizeString(metadataKey)}</Text>
            <Text
              weight='semibold'
              data-testid={`ListItemsMetadata-value-${metadataKey}`}
            >
              {metadataValue}
            </Text>
          </ListItem>
        )
      })}
    </>
  )
})

ResourceListItemsMetadata.displayName = 'ResourceListItemsMetadata'
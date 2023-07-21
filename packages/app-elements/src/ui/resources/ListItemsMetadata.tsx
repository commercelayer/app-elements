import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import type { Metadata } from '@commercelayer/sdk/lib/cjs/resource'

const ListItemsMetadata = withSkeletonTemplate<{
  metadata?: Metadata
}>(({ metadata }) => {
  if (metadata == null || Object.keys(metadata).length === 0) return <></>

  return (
    <>
      {Object.entries(metadata).map(([metadataKey, metadataValue], idx) => {
        if (typeof metadataValue !== 'string') return <></>

        return (
          <ListItem
            tag='div'
            key={idx}
            data-test-id={`ListItemsMetadata-item-${metadataKey}`}
          >
            <Text variant='info' className='capitalize'>
              {metadataKey}
            </Text>
            <Text
              weight='semibold'
              data-test-id={`ListItemsMetadata-value-${metadataKey}`}
            >
              {metadataValue}
            </Text>
          </ListItem>
        )
      })}
    </>
  )
})

ListItemsMetadata.displayName = 'ListItemsMetadata'
export { ListItemsMetadata }
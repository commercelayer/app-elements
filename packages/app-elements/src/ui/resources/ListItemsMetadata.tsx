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
      {Object.keys(metadata).map((metadataKey, idx) => {
        const metadataValue = metadata[metadataKey]

        if (typeof metadataValue !== 'string') return <></>

        return (
          <ListItem tag='div' key={idx}>
            <Text variant='info' className='capitalize'>
              {metadataKey}
            </Text>
            <Text weight='semibold'>{metadataValue}</Text>
          </ListItem>
        )
      })}
    </>
  )
})

ListItemsMetadata.displayName = 'ListItemsMetadata'
export { ListItemsMetadata }

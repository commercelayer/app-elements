import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Avatar, CardDialog, ListDetailsItem, Spacer, Text } from 'src/main'

export const Carrier = withSkeletonTemplate(() => {
  return (
    <CardDialog
      title='Express Easy'
      subtitle='DHL express'
      icon={<Avatar src='payments:adyen' alt='Adyen' shape='circle' />}
      rightContent={
        <Text size='regular' weight='bold'>
          $29
        </Text>
      }
    >
      <Spacer top='4'>
        <ListDetailsItem
          label='Status'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          In transit
        </ListDetailsItem>
        <ListDetailsItem
          label='Tracking'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          42314321ASD4545
        </ListDetailsItem>
        <ListDetailsItem
          label='Estimated delivery'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          May 17, 2023 12:00 AM
        </ListDetailsItem>
      </Spacer>
    </CardDialog>
  )
})

Carrier.displayName = 'Carrier'

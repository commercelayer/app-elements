import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { type Parcel as ParcelResource } from '@commercelayer/sdk'
import { Package } from '@phosphor-icons/react'
import {
  Avatar,
  CardDialog,
  ListDetailsItem,
  ListItem,
  Spacer,
  Text
} from 'src/main'
import { type SetNonNullable, type SetRequired } from 'type-fest'

type SetNonNullableRequired<
  BaseType,
  Keys extends keyof BaseType
> = SetRequired<SetNonNullable<BaseType, Keys>, Keys>

interface Props {
  parcel: SetNonNullableRequired<ParcelResource, 'package'>
  onRemove?: () => void
}

export const Parcel = withSkeletonTemplate<Props>(({ parcel, onRemove }) => {
  return (
    <CardDialog
      onClose={onRemove}
      title={parcel.package.name}
      icon={<Package size={42} className='text-gray-300' weight='thin' />}
    >
      {parcel.parcel_line_items?.map((parcelLineItem, index) => (
        <div key={parcelLineItem.id}>
          <ListItem
            tag='div'
            alignItems='top'
            borderStyle={
              parcel.parcel_line_items != null &&
              parcel.parcel_line_items.length - 1 === index
                ? 'solid'
                : 'dashed'
            }
            gutter='none'
            icon={
              <Avatar
                size='small'
                alt={parcelLineItem.name}
                src={parcelLineItem.image_url as `https://${string}`}
              />
            }
          >
            <div>
              <Text size='small' tag='div' variant='info' weight='medium'>
                {parcelLineItem.sku_code}
              </Text>
              <Text tag='div' weight='bold'>
                {parcelLineItem.name}
              </Text>
            </div>
            <div>
              <Text size='small' tag='div' variant='info' weight='medium'>
                &nbsp;
              </Text>
              <Text tag='div' variant='info' wrap='nowrap'>
                x {parcelLineItem.quantity}
              </Text>
            </div>
          </ListItem>
        </div>
      ))}
      <Spacer top='4'>
        <ListDetailsItem
          label='Total'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {parcel.parcel_line_items?.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}{' '}
          items
        </ListDetailsItem>
        <ListDetailsItem
          label='Weight'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {parcel.weight} {parcel.unit_of_weight}
        </ListDetailsItem>
      </Spacer>
    </CardDialog>
  )
})

Parcel.displayName = 'Parcel'

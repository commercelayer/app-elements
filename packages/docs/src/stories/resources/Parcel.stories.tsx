import { Parcel } from '#ui/resources/Parcel'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Resources/Parcel',
  component: Parcel,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof Parcel> = (args): JSX.Element => (
  <Parcel {...args} />
)
Default.args = {
  onRemove: function () {
    alert('removed')
  },
  parcel: {
    type: 'parcels',
    id: 'parcel-1',
    created_at: '',
    updated_at: '',
    unit_of_weight: 'gr',
    weight: 300,
    parcel_line_items: [
      {
        type: 'parcel_line_items',
        id: 'parcel-line-item-1',
        created_at: '',
        updated_at: '',
        name: 'White Men T-shirt with Pink Logo (M)',
        quantity: 1,
        sku_code: 'TSHIRTMMFFFFFFE63E74MXXX',
        image_url:
          'https://img.commercelayer.io/skus/TSHIRTMMFFFFFFE63E74.png?fm=jpg&q=90'
      },
      {
        type: 'parcel_line_items',
        id: 'parcel-line-item-2',
        created_at: '',
        updated_at: '',
        name: 'White Men T-shirt with Pink Logo (L)',
        quantity: 2,
        sku_code: 'TSHIRTMMFFFFFFE63E74LXXX',
        image_url:
          'https://img.commercelayer.io/skus/TSHIRTMMFFFFFFE63E74.png?fm=jpg&q=90'
      }
    ],
    package: {
      type: 'packages',
      created_at: '',
      height: 3,
      id: '',
      length: 3,
      unit_of_length: '',
      updated_at: '',
      width: 3,
      name: 'Large Box #1'
    }
  }
}

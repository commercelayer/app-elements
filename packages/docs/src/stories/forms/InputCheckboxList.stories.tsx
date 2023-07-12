import { Text } from '#ui/atoms/Text'
import { InputCheckboxList } from '#ui/forms/InputCheckboxList'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputCheckboxList> = {
  title: 'Forms/InputCheckboxList',
  component: InputCheckboxList,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputCheckboxList> = (args) => {
  const [values, setValues] = useState(args.defaultValues)
  return (
    <InputCheckboxList {...args} defaultValues={values} onChange={setValues} />
  )
}

export const Default = Template.bind({})
Default.args = {
  title: 'Items',
  defaultValues: [
    {
      value: 'BABYBIBXA19D9D000000XXXX',
      quantity: 4
    },
    {
      value: 'BASEBHAT000000FFFFFFXXXX',
      quantity: 7
    }
  ],
  options: [
    {
      value: 'BABYBIBXA19D9D000000XXXX',
      content: (
        <>
          <Text size='regular' tag='div' weight='bold'>
            Gray Baby Bib with Black Logo
          </Text>
          <Text size='small' tag='div' variant='info'>
            200g
          </Text>
        </>
      ),
      image: {
        url: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png',
        alt: 'Gray Baby Bib with Black Logo'
      },
      quantity: {
        min: 1,
        max: 5
      }
    },
    {
      value: 'BASEBHAT000000FFFFFFXXXX',
      content: (
        <>
          <Text size='regular' tag='div' weight='bold'>
            Black Baseball Hat with White Logo
          </Text>
          <Text size='small' tag='div' variant='info'>
            50g
          </Text>
        </>
      ),
      image: {
        url: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
        alt: 'Black Baseball Hat with White Logo'
      },
      quantity: {
        min: 1,
        max: 7
      }
    },
    {
      value: 'HOODIEUL000000FFFFFFLXXX',
      content: (
        <>
          <Text size='regular' tag='div' weight='bold'>
            Black Unisex Lightweight Hoodie
          </Text>
          <Text size='small' tag='div' variant='info'>
            150g
          </Text>
        </>
      ),
      image: {
        url: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png',
        alt: 'Black Unisex Lightweight Hoodie'
      },
      quantity: {
        min: 1,
        max: 8
      }
    }
  ]
}

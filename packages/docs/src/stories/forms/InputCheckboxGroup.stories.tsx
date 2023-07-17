import { Avatar } from '#ui/atoms/Avatar'
import { Text } from '#ui/atoms/Text'
import { InputCheckboxGroup } from '#ui/forms/InputCheckboxGroup'
import { ListItem } from '#ui/lists/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof InputCheckboxGroup> = {
  title: 'Forms/InputCheckboxGroup',
  component: InputCheckboxGroup,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputCheckboxGroup> = (args) => {
  const [values, setValues] = useState(args.defaultValues)
  return (
    <InputCheckboxGroup {...args} defaultValues={values} onChange={setValues} />
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
          <ListItem
            tag='div'
            borderStyle='none'
            alignItems='center'
            alignIcon='center'
            padding='none'
            icon={
              <Avatar
                size='small'
                src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png'
                alt='Gray Baby Bib with Black Logo'
              />
            }
          >
            <div>
              <Text size='regular' tag='div' weight='bold'>
                Gray Baby Bib with Black Logo
              </Text>
              <Text size='small' tag='div' variant='info'>
                200g
              </Text>
            </div>
          </ListItem>
        </>
      ),
      quantity: {
        min: 1,
        max: 5
      }
    },
    {
      value: 'BASEBHAT000000FFFFFFXXXX',
      content: (
        <>
          <ListItem
            tag='div'
            borderStyle='none'
            alignItems='center'
            alignIcon='center'
            padding='none'
            icon={
              <Avatar
                size='small'
                src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png'
                alt='Black Baseball Hat with White Logo'
              />
            }
          >
            <div>
              <Text size='regular' tag='div' weight='bold'>
                Black Baseball Hat with White Logo
              </Text>
              <Text size='small' tag='div' variant='info'>
                50g
              </Text>
            </div>
          </ListItem>
        </>
      ),
      quantity: {
        min: 1,
        max: 7
      }
    },
    {
      value: 'HOODIEUL000000FFFFFFLXXX',
      content: (
        <>
          <ListItem
            tag='div'
            borderStyle='none'
            alignItems='center'
            alignIcon='center'
            padding='none'
            icon={
              <Avatar
                size='small'
                src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png'
                alt='Black Unisex Lightweight Hoodie'
              />
            }
          >
            <div>
              <Text size='regular' tag='div' weight='bold'>
                Black Unisex Lightweight Hoodie
              </Text>
              <Text size='small' tag='div' variant='info'>
                150g
              </Text>
            </div>
          </ListItem>
        </>
      ),
      quantity: {
        min: 1,
        max: 8
      }
    },
    {
      value: 'TOTEBAGLE7DDC7000000XXXX',
      content: (
        <>
          <ListItem
            tag='div'
            borderStyle='none'
            alignItems='center'
            padding='none'
          >
            <div>
              <Text size='regular' tag='div' weight='bold'>
                Large Eco Tote Bag with Black Logo
              </Text>
            </div>
          </ListItem>
        </>
      ),
      quantity: {
        min: 1,
        max: 5
      }
    },
    {
      value: 'DHL',
      content: (
        <>
          <ListItem
            tag='div'
            alignIcon='center'
            borderStyle='none'
            padding='none'
            icon={
              <Avatar
                size='small'
                shape='circle'
                border='none'
                src='carriers:dhl'
                alt='DHL'
              />
            }
          >
            <div>
              <Text size='regular' weight='bold'>
                Express Easy
              </Text>
              <Text size='small' tag='div' variant='info' weight='medium'>
                DHL Express
              </Text>
            </div>
            <Text size='regular' weight='bold' wrap='nowrap'>
              €37,61
            </Text>
          </ListItem>
        </>
      ),
      quantity: {
        min: 1,
        max: 5
      }
    }
  ]
}

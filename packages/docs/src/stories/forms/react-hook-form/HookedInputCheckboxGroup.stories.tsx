import { Avatar } from '#ui/atoms/Avatar'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputCheckboxGroup } from '#ui/forms/InputCheckboxGroup'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputCheckboxGroup> = {
  title: 'Forms/react-hook-form/HookedInputCheckboxGroup',
  component: HookedInputCheckboxGroup,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}
export default setup

const Template: StoryFn<typeof HookedInputCheckboxGroup> = (args) => {
  const methods = useForm({
    defaultValues: {
      items: [
        {
          value: 'BABYBIBXA19D9D000000XXXX',
          quantity: 4
        },
        {
          value: 'BASEBHAT000000FFFFFFXXXX',
          quantity: 7
        }
      ]
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputCheckboxGroup {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  title: 'Items',
  name: 'items',
  options: [
    {
      value: 'BABYBIBXA19D9D000000XXXX',
      icon: (
        <Avatar
          size='small'
          src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png'
          alt='Gray Baby Bib with Black Logo'
        />
      ),
      content: (
        <div>
          <Text size='regular' tag='div' weight='bold'>
            Gray Baby Bib with Black Logo
          </Text>
          <Text size='small' tag='div' variant='info'>
            200g
          </Text>
        </div>
      ),
      quantity: {
        min: 2,
        max: 6
      }
    },
    {
      value: 'BASEBHAT000000FFFFFFXXXX',
      icon: (
        <Avatar
          size='small'
          src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png'
          alt='Black Baseball Hat with White Logo'
        />
      ),
      content: (
        <div>
          <Text size='regular' tag='div' weight='bold'>
            Black Baseball Hat with White Logo
          </Text>
          <Text size='small' tag='div' variant='info'>
            50g
          </Text>
        </div>
      ),
      quantity: {
        min: 1,
        max: 7
      }
    },
    {
      value: 'HOODIEUL000000FFFFFFLXXX',
      icon: (
        <Avatar
          size='small'
          src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png'
          alt='Black Unisex Lightweight Hoodie'
        />
      ),
      content: (
        <div>
          <Text size='regular' tag='div' weight='bold'>
            Black Unisex Lightweight Hoodie
          </Text>
          <Text size='small' tag='div' variant='info'>
            150g
          </Text>
        </div>
      ),
      quantity: {
        min: 1,
        max: 8
      }
    },
    {
      value: 'TOTEBAGLE7DDC7000000XXXX',
      content: (
        <div>
          <Text size='regular' tag='div' weight='bold'>
            Large Eco Tote Bag with Black Logo
          </Text>
        </div>
      ),
      quantity: {
        min: 1,
        max: 5
      }
    },
    {
      value: 'DHL',
      icon: (
        <Avatar
          size='small'
          shape='circle'
          border='none'
          src='carriers:dhl'
          alt='DHL'
        />
      ),
      content: (
        <>
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
        </>
      ),
      quantity: {
        min: 1,
        max: 5
      }
    }
  ]
}

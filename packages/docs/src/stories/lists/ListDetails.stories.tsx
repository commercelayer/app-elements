import { Avatar } from '#ui/atoms/Avatar'
import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Text } from '#ui/atoms/Text'
import { ListDetails } from '#ui/lists/ListDetails'
import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ListItem } from '#ui/lists/ListItem'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ListDetails> = {
  title: 'Lists/ListDetails',
  component: ListDetails,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ListDetails> = (args) => (
  <ListDetails {...args}>
    <ListDetailsItem label='ID:'>
      <CopyToClipboard value='WGDMSMNOwJ' />
    </ListDetailsItem>
    <ListDetailsItem label='Code:'>
      <CopyToClipboard value='CROPTOPWE8E8E8000000MXXX' />
    </ListDetailsItem>
    <ListDetailsItem label='Created at:'>
      2022-06-15T14:57:00.471Z
    </ListDetailsItem>
    <ListDetailsItem label='Updated at:'>
      <CopyToClipboard />
    </ListDetailsItem>
    <ListDetailsItem label='Description:'>
      <CopyToClipboard value='Body-hugging crop top that will become the centerpiece of any summer outfit! 82% polyester, 18% spandex. Made with a smooth and comfortable microfiber yarn.' />
    </ListDetailsItem>
  </ListDetails>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Attributes',
  isLoading: false
}

export const WithListItem: StoryFn<typeof ListDetails> = (args) => (
  <ListDetails {...args}>
    {Array(3).fill(
      <ListItem
        tag='div'
        gutter='none'
        borderStyle='dashed'
        icon={
          <Avatar
            src='https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png'
            alt='Black Hat'
          />
        }
      >
        <div>
          <Text size='small' weight='medium' variant='info' tag='div'>
            SKU 543289
          </Text>
          <Text tag='div' weight='bold'>
            Black Baby Short Sleeve with pink logo 12 months size XL
          </Text>
        </div>
        <Text weight='medium' variant='info' tag='div' wrap='nowrap'>
          $69,50 x 2
        </Text>
        <Text weight='bold' tag='div'>
          $139,00
        </Text>
      </ListItem>
    )}
  </ListDetails>
)
WithListItem.args = {
  title: 'Summary',
  isLoading: false
}

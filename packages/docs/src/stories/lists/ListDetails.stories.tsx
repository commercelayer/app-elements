import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { ListDetails } from '#ui/lists/ListDetails'
import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof ListDetails> = {
  title: 'Lists/ListDetails',
  component: ListDetails,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListDetails> = (args) => (
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

import ListDetailsItem from '#core-app-elements/lists/ListDetailsItem'
import ListDetails from '#core-app-elements/lists/ListDetails'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import CopyToClipboard from '#core-app-elements/atoms/CopyToClipboard'

const setup: ComponentMeta<typeof ListDetails> = {
  title: 'Lists/ListDetails',
  component: ListDetails,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListDetails> = (args) => (
  <Container minHeight={false}>
    <ListDetails {...args}>
      <ListDetailsItem label='ID:'>
        <CopyToClipboard value='WGDMSMNOwJ' />
      </ListDetailsItem>
      <ListDetailsItem label='Code:'>
        <CopyToClipboard value='CROPTOPWE8E8E8000000MXXX' />
      </ListDetailsItem>
      <ListDetailsItem label='Created at:' hasGutter>
        2022-06-15T14:57:00.471Z
      </ListDetailsItem>
      <ListDetailsItem label='Description:'>
        <CopyToClipboard value='Body-hugging crop top that will become the centerpiece of any summer outfit! 82% polyester, 18% spandex. Made with a smooth and comfortable microfiber yarn.' />
      </ListDetailsItem>
    </ListDetails>
  </Container>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Attributes',
  isLoading: false
}

import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof CopyToClipboard> = {
  title: 'Atoms/CopyToClipboard',
  component: CopyToClipboard,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const TemplateDefault: ComponentStory<typeof CopyToClipboard> = (args) => (
  <CopyToClipboard {...args} />
)
export const Default = TemplateDefault.bind({})
Default.args = {
  value: 'BEANIEXXFFFFFF000000XXXX'
}

const TemplateStacked: ComponentStory<typeof CopyToClipboard> = (args) => (
  <>
    <CopyToClipboard {...args} />
    <CopyToClipboard value='Soft double-layered customizable beanie. 95% polyester, 5% spandex. Regular fit. Accurately printed, cut, and hand-sewn.' />
    <CopyToClipboard value='https://data.commercelayer.app/seed/images/skus/BEANIEXXFFFFFF000000XXXX_FLAT.png' />
  </>
)

export const Stacked = TemplateStacked.bind({})
Stacked.args = {
  value: 'BEANIEXXFFFFFF000000XXXX'
}

const TemplateEmpty: ComponentStory<typeof CopyToClipboard> = (args) => (
  <>
    <CopyToClipboard {...args} />
    <CopyToClipboard {...args} />
  </>
)
export const Empty = TemplateEmpty.bind({})
Empty.args = {
  value: ''
}

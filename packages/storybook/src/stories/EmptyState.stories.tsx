import EmptyState from '#core-app-elements/atoms/EmptyState'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import A from '#core-app-elements/atoms/A'
import Button from '#core-app-elements/atoms/Button'

const setup: ComponentMeta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof EmptyState> = (args) => (
  <Container minHeight={false}>
    <EmptyState {...args} />
  </Container>
)

export const Default = Template.bind({})
Default.args = {
  title: 'No imports yet!',
  description: 'Create your first import',
  action: <Button variant='primary'>New import</Button>
}

const TemplateWithIcon: ComponentStory<typeof EmptyState> = (args) => (
  <Container minHeight={false}>
    <EmptyState {...args} />
  </Container>
)
export const WithIcon = TemplateWithIcon.bind({})
WithIcon.args = {
  title: 'No adjustment yet!',
  description: (
    <>
      Add a adjustment with the API, or use the CLI. <A>View API reference.</A>
    </>
  ),
  icon: 'stack'
}

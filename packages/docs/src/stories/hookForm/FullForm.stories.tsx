import { ComponentStory, ComponentMeta } from '@storybook/react'
import { FullForm } from './FullForm'

const setup: ComponentMeta<typeof FullForm> = {
  title: 'Forms/ReactHookForm',
  component: FullForm,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof FullForm> = () => {
  return <FullForm />
}

export const Sample = Template.bind({})

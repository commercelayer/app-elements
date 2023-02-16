import { A } from '#core-app-elements/atoms/A'
import { Hint } from '#core-app-elements/atoms/Hint'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Hint> = {
  title: 'Atoms/Hint',
  component: Hint
}
export default setup

const Template: ComponentStory<typeof Hint> = (args) => <Hint {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Please consider this as an helpful description'
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  children: (
    <div>
      Check our <A>documentation</A>.
    </div>
  ),
  icon: 'bulb'
}

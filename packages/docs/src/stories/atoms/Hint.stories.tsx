import { A } from '#ui/atoms/A'
import { Hint } from '#ui/atoms/Hint'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof Hint> = {
  title: 'Atoms/Hint',
  component: Hint
}
export default setup

const Template: StoryFn<typeof Hint> = (args) => <Hint {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Please consider this as an helpful description'
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  children: (
    <div>
      Check our <A href='https://docs.commercelayer.io/core'>documentation</A>.
    </div>
  ),
  icon: 'lightbulbFilament'
}

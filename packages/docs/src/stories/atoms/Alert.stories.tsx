import { Alert } from '#ui/atoms/Alert'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof Alert> = {
  title: 'Atoms/Alert',
  component: Alert
}
export default setup

const Template: StoryFn<typeof Alert> = (args) => (
  <Alert {...args}>
    The new total is $80,00, $3.00 more than the original total.
    <br />
    Adjust the total to make it equal or less.
  </Alert>
)

export const Default = Template.bind({})
Default.args = {
  status: 'warning'
}

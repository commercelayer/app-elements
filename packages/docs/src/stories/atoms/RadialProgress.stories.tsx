import { RadialProgress } from '#ui/atoms/RadialProgress'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof RadialProgress> = {
  title: 'Atoms/RadialProgress',
  component: RadialProgress,

  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 }
    }
  }
}
export default setup

const Template: StoryFn<typeof RadialProgress> = (args) => (
  <RadialProgress {...args} />
)

export const Default = Template.bind({})
Default.args = {}

/**
 * Default pending state: no percentage, no icon
 */
export const Pending = Template.bind({})
Pending.args = {}

/**
 * Progress state will show a filled border based on the value of the `percentage` prop.
 * <span type="info">
 * Note: when there is no icon, the inner of the component is transparent. You can see this since the following example comes with a gray canvas.
 * </span>
 */
export const Percentage = Template.bind({})
Percentage.args = {
  percentage: 42
}
Percentage.parameters = {
  backgrounds: {
    default: 'custom',
    values: [{ name: 'custom', value: '#d9d9d9' }]
  }
}

/**
 * You can optionally pass an icon to be rendered in the center of the circle.
 * <span type="info">
 * Note: when there is an icon, the inner of the component is white. You can see this since the following example comes with a gray canvas.
 * </span>
 */
export const WithIcon = Template.bind({})
WithIcon.args = {
  percentage: undefined,
  icon: 'shoppingBag'
}
WithIcon.parameters = {
  backgrounds: {
    default: 'custom',
    values: [{ name: 'custom', value: '#d9d9d9' }]
  }
}

/**
 * Both pending and progress states can be rendered in a small size.
 */
export const PendingSmall = Template.bind({})
PendingSmall.args = {
  percentage: undefined,
  size: 'small'
}

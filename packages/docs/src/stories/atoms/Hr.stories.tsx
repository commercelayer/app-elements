import { Hr } from '#ui/atoms/Hr'
import { Description, Primary, Subtitle, Title } from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Hr> = {
  title: 'Atoms/Hr',
  component: Hr,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
        </>
      )
    }
  }
}
export default setup

const Template: StoryFn<typeof Hr> = (args) => <Hr {...args} />

export const Default = Template.bind({})
Default.args = {}

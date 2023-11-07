import { Hr } from '#ui/atoms/Hr'
import { Description, Stories, Subtitle, Title } from '@storybook/addon-docs'
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
          <Stories />
        </>
      )
    }
  }
}
export default setup

const Template: StoryFn<typeof Hr> = (args) => <Hr {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Dashed = Template.bind({})
Dashed.args = {
  variant: 'dashed'
}

import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { ResourceAttachments } from '#ui/resources/ResourceAttachments'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof ResourceAttachments> = {
  title: 'Resources/ResourceAttachments',
  component: ResourceAttachments,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ResourceAttachments> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceAttachments {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  resourceType: 'orders',
  resourceId: 'NMWYhbGorj'
}

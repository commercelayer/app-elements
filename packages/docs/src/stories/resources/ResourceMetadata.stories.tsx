import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { ResourceMetadata } from '#ui/resources/ResourceMetadata'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceMetadata> = {
  title: 'Resources/ResourceMetadata',
  component: ResourceMetadata,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ResourceMetadata> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='customers' devMode>
      <CoreSdkProvider>
        <ResourceMetadata {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resourceType: 'customers',
  resourceId: 'NMWYhbGorj',
  overlay: {
    title: 'Edit metadata',
    description: 'hello@commercelayer.io'
  }
}

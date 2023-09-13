import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { ResourceTags } from '#ui/resources/ResourceTags'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceTags> = {
  title: 'Resources/ResourceTags',
  component: ResourceTags,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ResourceTags> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='customers' devMode>
      <CoreSdkProvider>
        <ResourceTags {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resourceType: 'customers',
  resourceId: 'NMWYhbGorj',
  overlay: {
    title: 'Edit tags',
    description: 'hello@commercelayer.io',
    showManageAction: true
  },
  onTagClick: (tagId) => {
    console.log('onTagClick - tadId: ', tagId)
  }
}

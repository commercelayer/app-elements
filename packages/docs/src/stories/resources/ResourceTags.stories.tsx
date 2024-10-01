import { useEditTagsOverlay } from '#hooks/useEditTagsOverlay'
import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Dropdown, DropdownItem } from '#ui/composite/Dropdown'
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

/**
 * When `tags` are not defined the component doesn't render at all.
 */
export const WithoutTags = Template.bind({})
WithoutTags.args = {
  resourceType: 'customers',
  resourceId: 'OEMAhobdgO',
  overlay: {
    title: 'Edit tags',
    description: 'hello@commercelayer.io'
  }
}

/** If you need to edit the tags from outside the `ResourceTags` component you can use the `useEditTagsOverlay` hook: */
export const EditTagsOverlay: StoryFn = () => {
  const { Overlay: EditTagsOverlay, show } = useEditTagsOverlay()

  return (
    <TokenProvider kind='integration' appSlug='customers' devMode>
      <CoreSdkProvider>
        <EditTagsOverlay
          title='Edit tags'
          description='hello@commercelayer.io'
          resourceId='ASEYfdNrwa'
          resourceType='customers'
        />
        <Dropdown
          menuPosition='bottom-left'
          dropdownItems={
            <>
              <DropdownItem onClick={show} label='Edit tags' />
            </>
          }
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}
EditTagsOverlay.decorators = [
  (Story) => (
    <div
      style={{
        paddingBottom: '100px'
      }}
    >
      <Story />
    </div>
  )
]

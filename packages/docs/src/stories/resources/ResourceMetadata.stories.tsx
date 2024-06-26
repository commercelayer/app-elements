import { useEditMetadataOverlay } from '#hooks/useEditMetadataOverlay'
import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Dropdown, DropdownItem } from '#ui/composite/Dropdown'
import { ResourceMetadata } from '#ui/resources/ResourceMetadata'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
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

/**
 * When mode attribute is set to `simple` you'll be able just to edit the metadata values.
 */
export const Simple = Template.bind({})
Simple.args = {
  resourceType: 'customers',
  resourceId: 'NMWYhbGorj',
  mode: 'simple',
  overlay: {
    title: 'Edit metadata',
    description: 'hello@commercelayer.io'
  }
}

/**
 * When `metadata` are not defined the component doesn't render at all.
 */
export const WithoutMetadata = Template.bind({})
WithoutMetadata.args = {
  resourceType: 'customers',
  resourceId: 'OEMAhobdgO',
  overlay: {
    title: 'Edit metadata',
    description: 'hello@commercelayer.io'
  }
}

/** If you don't need the readonly metadata table, but you still want to edit the metadata, you can use the `useEditMetadataOverlay` hook: */
export const EditMetadataOverlay: StoryFn = () => {
  const { Overlay: EditMetadataOverlay, show } = useEditMetadataOverlay()

  return (
    <TokenProvider kind='integration' appSlug='customers' devMode>
      <CoreSdkProvider>
        <EditMetadataOverlay
          title='Edit metadata'
          description='hello@commercelayer.io'
          resourceId='ASEYfdNrwa'
          resourceType='customers'
        />
        <Dropdown
          menuPosition='bottom-left'
          dropdownItems={
            <>
              <DropdownItem onClick={show} label='Edit metadata' />
            </>
          }
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}
EditMetadataOverlay.decorators = [
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

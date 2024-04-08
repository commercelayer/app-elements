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

export const WithOverlay: StoryFn = () => {
  const { Overlay: EditMetadataOverlay, show } = useEditMetadataOverlay()

  return (
    <>
      <EditMetadataOverlay
        title='Edit metadata'
        description='hello@commercelayer.io'
        resourceId='OEMAhobdgO'
        resourceType='customers'
        mode='advanced'
      />
      <Dropdown
        menuPosition='bottom-left'
        dropdownItems={
          <>
            <DropdownItem onClick={show} label='Edit metadata' />
          </>
        }
      />
    </>
  )
}

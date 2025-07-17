import type { Meta, StoryFn } from "@storybook/react-vite"
import { useEditMetadataOverlay } from "#hooks/useEditMetadataOverlay"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { ResourceMetadata } from "#ui/resources/ResourceMetadata"

const setup: Meta = {
  title: "Resources/ResourceMetadata",
  component: ResourceMetadata,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof ResourceMetadata> = (args) => {
  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <ResourceMetadata {...args} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resourceType: "customers",
  resourceId: "NMWYhbGorj",
  overlay: {
    title: "hello@commercelayer.io",
  },
}

/**
 * When `metadata` are not defined the component doesn't render at all.
 */
export const WithoutMetadata = Template.bind({})
WithoutMetadata.args = {
  resourceType: "customers",
  resourceId: "OEMAhobdgO",
  overlay: {
    title: "hello@commercelayer.io",
  },
}

/** If you need to edit the metadata from outside the `ResourceMetadata` component you can use the `useEditMetadataOverlay` hook: */
export const EditMetadataOverlay: StoryFn = () => {
  const { Overlay: EditMetadataOverlay, show } = useEditMetadataOverlay()

  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <EditMetadataOverlay
          title="hello@commercelayer.io"
          resourceId="ASEYfdNrwa"
          resourceType="customers"
        />
        <Dropdown
          menuPosition="bottom-left"
          dropdownItems={<DropdownItem onClick={show} label="Edit metadata" />}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}
EditMetadataOverlay.decorators = [
  (Story) => (
    <div
      style={{
        paddingBottom: "100px",
      }}
    >
      <Story />
    </div>
  ),
]

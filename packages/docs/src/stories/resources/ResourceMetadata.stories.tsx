import type { Meta, StoryFn } from "@storybook/react-vite"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import {
  ResourceMetadata,
  useResourceMetadataModal,
} from "#ui/resources/ResourceMetadata"

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
  modal: {
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
  modal: {
    title: "hello@commercelayer.io",
  },
}

/** If you need to edit the metadata from outside the `ResourceMetadata` component you can use the `useResourceMetadataModal` hook: */
export const EditMetadataModal: StoryFn = () => {
  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <EditMetadataModalTrigger />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/** The hook needs the providers above it, so it lives in a child of the story. */
const EditMetadataModalTrigger = (): React.JSX.Element => {
  const { metadataModal, openMetadataModal } = useResourceMetadataModal({
    title: "hello@commercelayer.io",
    resourceId: "ASEYfdNrwa",
    resourceType: "customers",
  })

  return (
    <>
      {metadataModal}
      <Dropdown
        menuPosition="bottom-left"
        dropdownItems={
          <DropdownItem onClick={openMetadataModal} label="Edit metadata" />
        }
      />
    </>
  )
}
EditMetadataModal.decorators = [
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

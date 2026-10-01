import type { Meta, StoryFn } from "@storybook/react-vite"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { ResourceTags, useResourceTagsModal } from "#ui/resources/ResourceTags"

const setup: Meta<typeof ResourceTags> = {
  title: "Resources/ResourceTags",
  component: ResourceTags,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof ResourceTags> = (args) => {
  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <ResourceTags {...args} />
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
    showManageAction: true,
  },
  onTagClick: (tagId) => {
    console.log("onTagClick - tadId: ", tagId)
  },
}

/**
 * When `tags` are not defined the component doesn't render at all.
 */
export const WithoutTags = Template.bind({})
WithoutTags.args = {
  resourceType: "customers",
  resourceId: "OEMAhobdgO",
  modal: {
    title: "hello@commercelayer.io",
  },
}

/** If you need to edit the tags from outside the `ResourceTags` component you can use the `useResourceTagsModal` hook: */
export const EditTagsModal: StoryFn = () => {
  return (
    <TokenProvider kind="integration" appSlug="customers" devMode>
      <CoreSdkProvider>
        <EditTagsModalTrigger />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/** The hook needs the providers above it, so it lives in a child of the story. */
const EditTagsModalTrigger = (): React.JSX.Element => {
  const { tagsModal, openTagsModal } = useResourceTagsModal({
    title: "hello@commercelayer.io",
    showManageAction: true,
    resourceId: "ASEYfdNrwa",
    resourceType: "customers",
  })

  return (
    <>
      {tagsModal}
      <Dropdown
        menuPosition="bottom-left"
        dropdownItems={
          <DropdownItem onClick={openTagsModal} label="Edit tags" />
        }
      />
    </>
  )
}
EditTagsModal.decorators = [
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

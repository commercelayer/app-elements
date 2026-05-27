import type { Meta, StoryFn } from "@storybook/react-vite"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Button } from "#ui/atoms/Button"
import { useResourceModal } from "#ui/resources/useResourceModal"

const setup: Meta = {
  title: "Resources/useResourceModal",
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    ),
  ],
}

export default setup

/**
 * Click the button to open a modal that shows the provided resource details as JSON.
 */
export const Default: StoryFn = () => {
  const { ResourceModal, openResourceModal } = useResourceModal({
    resourceType: "orders",
    resourceId: "NMWYhbGorj",
  })

  return (
    <>
      <ResourceModal />
      <Button onClick={openResourceModal}>Open resource modal</Button>
    </>
  )
}

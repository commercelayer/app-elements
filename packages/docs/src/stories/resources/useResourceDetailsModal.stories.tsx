import type { Meta, StoryFn } from "@storybook/react-vite"
import type { ReactNode } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import type { TokenProviderExtras } from "#providers/TokenProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Button } from "#ui/atoms/Button"
import { Text } from "#ui/atoms/Text"
import {
  ResourceDetailsContent,
  useResourceDetailsModal,
} from "#ui/resources/ResourceDetailsModal"
import { presetResourceListItem } from "#ui/resources/ResourceListItem/ResourceListItem.mocks"

/**
 * Shows a resource's details in a modal: its attributes, any tabs you add, and
 * its event stream.
 *
 * Nothing is fetched for you: pass a resource you already have. That keeps
 * `include`/`fields` decisions in your hands and avoids re-requesting a record
 * that is usually already loaded.
 *
 * The hook returns `modal` as an element, so render it directly:
 *
 * ```tsx
 * const { modal, open } = useResourceDetailsModal({ resource })
 * return <><Button onClick={open}>Details</Button>{modal}</>
 * ```
 */
const setup: Meta = {
  title: "Resources/useResourceDetailsModal",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
    },
  },
}
export default setup

/** Derived from the hook, so this package doesn't need the SDK types itself. */
type ModalProps = Parameters<typeof useResourceDetailsModal>[0]

/**
 * The shared mocked order, given a real-looking id so the Events tab can
 * resolve its `event_stores` against the mocked API.
 */
const order = {
  ...presetResourceListItem.orderAwaitingApproval,
  id: "NgojhKoyYN",
} as unknown as ModalProps["resource"]

/** Enterprise organizations see the event timeline; everyone else sees an upsell. */
const enterprise: TokenProviderExtras = {
  organization: { isEnterprise: true },
}

const Providers = ({
  children,
  extras,
}: {
  children: ReactNode
  extras?: TokenProviderExtras
}) => (
  <TokenProvider kind="integration" appSlug="orders" devMode extras={extras}>
    <CoreSdkProvider>{children}</CoreSdkProvider>
  </TokenProvider>
)

const OpenModal = (props: ModalProps): React.JSX.Element => {
  const { modal, open } = useResourceDetailsModal(props)

  return (
    <div>
      <Button onClick={open}>Open details</Button>
      {modal}
    </div>
  )
}

/**
 * Attributes and Events, with the resource already in hand. The order's
 * `market` and `billing_address` relationships are filtered out of the
 * attribute list, so they don't show up as raw JSON.
 */
export const Default: StoryFn = () => (
  <Providers extras={enterprise}>
    <OpenModal resource={order} title="Order details" />
  </Providers>
)

/**
 * Extra tabs are rendered between Attributes and Events, and receive the
 * resource so they can display data you already loaded.
 */
export const WithAdditionalTabs: StoryFn = () => (
  <Providers extras={enterprise}>
    <OpenModal
      resource={order}
      title="Order details"
      tabs={[
        {
          name: "Payment",
          content: (resource) => (
            <Text>
              Payment status:{" "}
              {(resource as { payment_status?: string }).payment_status}
            </Text>
          ),
        },
      ]}
    />
  </Providers>
)

/**
 * While you are still fetching, pass `isLoading` to render skeletons in place
 * of the attribute list.
 */
export const Loading: StoryFn = () => (
  <Providers extras={enterprise}>
    <OpenModal resource={order} isLoading />
  </Providers>
)

/**
 * Event stores are an Enterprise feature. For organizations without it, the
 * Events tab shows an upsell instead of the timeline.
 */
export const WithoutEventStores: StoryFn = () => (
  <Providers>
    <OpenModal resource={order} title="Order details" />
  </Providers>
)

/**
 * The same content without the modal. `ResourceDetailsContent` takes the same
 * props and can be dropped straight into a page.
 *
 * Leave `panelHeight` unset when embedding, so the content flows with the page
 * instead of gaining a nested scrollbar. The modal sets it to `70vh` to stop
 * itself resizing as you switch tabs.
 *
 * ```tsx
 * <ResourceDetailsContent resource={order} />
 * ```
 */
export const Embedded: StoryFn = () => (
  <Providers extras={enterprise}>
    <ResourceDetailsContent resource={order} />
  </Providers>
)

/**
 * The embedded variant for an organization without event stores.
 */
export const EmbeddedWithoutEventStores: StoryFn = () => (
  <Providers>
    <ResourceDetailsContent resource={order} />
  </Providers>
)

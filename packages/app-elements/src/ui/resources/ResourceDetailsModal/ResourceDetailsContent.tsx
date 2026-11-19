import type { Resource, ResourceTypeLock } from "@commercelayer/sdk"
import cn from "classnames"
import { type FC, type ReactNode, useId } from "react"
import { t } from "#providers/i18n"
import { Spacer } from "#ui/atoms/Spacer"
import { Tab, Tabs, type TabsProps } from "#ui/atoms/Tabs"
import { ResourceAttributes } from "./ResourceAttributes"
import { ResourceEvents } from "./ResourceEvents"
import {
  ResourceRelationships,
  type ResourceRelationshipsConfig,
} from "./ResourceRelationships"

export interface ResourceDetailsTab {
  /** Tab label. */
  name: string
  /** Receives the resource, so the tab can render data already loaded by the caller. */
  content: (resource: Resource) => ReactNode
}

export interface ResourceDetailsContentProps {
  /**
   * The resource to display, already loaded by the caller.
   *
   * Nothing is fetched here: the caller decides what to sideload, which keeps
   * `include`/`fields` policy out of this component and avoids re-requesting a
   * resource that is often already in hand.
   */
  resource: Resource
  /** Renders skeletons while the caller is still loading the resource. */
  isLoading?: boolean
  /**
   * Shows a Relationships tab right after Attributes. Has-one relationships
   * the caller sideloaded are read from `resource`; any other is fetched only
   * when its row is expanded. Leave it unset to hide the tab.
   */
  relationships?: ResourceRelationshipsConfig
  /** Extra tabs, rendered between Attributes (or Relationships) and Events. */
  tabs?: ResourceDetailsTab[]
  /**
   * Fixed height for each tab panel, e.g. `"70vh"`, which then scrolls on its
   * own. Set it when the surrounding container must not resize as tabs change
   * and cannot scroll as a whole. Leave it unset on a page, so content flows
   * naturally instead of gaining a nested scrollbar.
   */
  panelHeight?: string
  /**
   * Size of the tab row. `small` suits a side column, next to a list.
   * @default regular
   */
  tabsSize?: TabsProps["size"]
  /**
   * Lets the tab row run from edge to edge of the container, with the tabs and
   * their content kept 24px from the sides, the tabs 16px from the top and the
   * content 12px under the row. For a container with no padding of its own,
   * such as a side column next to a list.
   */
  edgeToEdge?: boolean
  /**
   * Fills the height of the container, which must have one: the tab row stays
   * in place and only the open panel scrolls, so its scrollbar starts under the
   * row. For a modal or a side column that should not scroll as a whole.
   */
  fillHeight?: boolean
  /**
   * Id for the tab list, used to build the ids that link each tab to its panel.
   * Defaults to a generated one, so several instances can coexist on the same
   * page without colliding.
   */
  id?: string
}

/**
 * Tabbed view of a single resource: its attributes, its relationships when
 * asked for, any tabs the caller adds, and its event stream.
 *
 * Usable on its own inside a page, or wrapped in a modal via
 * `useResourceDetailsModal`.
 */
export const ResourceDetailsContent: FC<ResourceDetailsContentProps> = ({
  resource,
  isLoading = false,
  relationships,
  tabs = [],
  panelHeight,
  tabsSize,
  edgeToEdge = false,
  fillHeight = false,
  id,
}) => {
  const generatedId = useId()

  return (
    <Tabs
      id={id ?? `resource-details${generatedId}`}
      size={tabsSize}
      className={cn({
        // the row keeps its full width, its tabs take the gutter
        "[&_[role=tablist]]:px-6 [&_[role=tablist]]:pt-4 [&_[role=tabpanel]]:pt-3":
          edgeToEdge,
        // the row stays put and the open panel scrolls under it
        "h-full flex flex-col [&>[role=tabpanel]]:flex-1 [&>[role=tabpanel]]:min-h-0 [&>[role=tabpanel]]:overflow-y-auto [&>[role=tabpanel]]:pb-6":
          fillHeight,
      })}
    >
      {[
        <Tab key="attributes" name={t("common.resource_details.attributes")}>
          <TabPanel height={panelHeight} hasGutter={edgeToEdge}>
            <ResourceAttributes resource={resource} isLoading={isLoading} />
          </TabPanel>
        </Tab>,

        ...(relationships != null
          ? [
              <Tab
                key="relationships"
                name={t("common.resource_details.relationships")}
              >
                <TabPanel height={panelHeight} hasGutter={edgeToEdge}>
                  <ResourceRelationships
                    resource={resource}
                    {...relationships}
                  />
                </TabPanel>
              </Tab>,
            ]
          : []),

        ...tabs.map((tab) => (
          <Tab key={tab.name} name={tab.name}>
            <TabPanel height={panelHeight} hasGutter={edgeToEdge}>
              {tab.content(resource)}
            </TabPanel>
          </Tab>
        )),

        <Tab key="events" name={t("common.resource_details.events")}>
          <TabPanel height={panelHeight} hasGutter={edgeToEdge}>
            <ResourceEvents
              resourceId={resource.id}
              resourceType={resource.type as ResourceTypeLock}
            />
          </TabPanel>
        </Tab>,
      ]}
    </Tabs>
  )
}

/**
 * Wraps a tab's content, optionally pinning it to a fixed height so switching
 * tabs can't resize the container.
 *
 * Styled inline rather than with utility classes: consumers of this library
 * have no Tailwind build of their own, and keeping the height configurable at
 * runtime rules out a static class anyway.
 */
const TabPanel: FC<{
  height?: string
  hasGutter: boolean
  children: ReactNode
}> = ({ height, hasGutter, children }) => {
  if (height == null) {
    return (
      <Spacer
        top={getPanelTop(hasGutter)}
        className={cn({ "px-6": hasGutter })}
      >
        {children}
      </Spacer>
    )
  }

  return (
    <div style={{ height, overflowY: "auto" }}>
      <div className={cn("h-full", { "pt-2": !hasGutter, "px-6": hasGutter })}>
        {children}
      </div>
    </div>
  )
}

/**
 * Room between the tab row and the content. An edge-to-edge row sets it on the
 * whole panel instead, to the design's 12px.
 */
function getPanelTop(hasGutter: boolean): "2" | undefined {
  if (hasGutter) {
    return undefined
  }

  return "2"
}

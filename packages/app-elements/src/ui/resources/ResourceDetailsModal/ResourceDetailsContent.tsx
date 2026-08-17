import type { Resource, ResourceTypeLock } from "@commercelayer/sdk"
import { type FC, type ReactNode, useId } from "react"
import { t } from "#providers/I18NProvider"
import { Spacer } from "#ui/atoms/Spacer"
import { Tab, Tabs } from "#ui/atoms/Tabs"
import { ResourceAttributes } from "./ResourceAttributes"
import { ResourceEvents } from "./ResourceEvents"

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
  /** Extra tabs, rendered between Attributes and Events. */
  tabs?: ResourceDetailsTab[]
  /**
   * Fixed height for each tab panel, e.g. `"70vh"`. Set it when the surrounding
   * container must not resize as tabs change (a modal, typically). Leave it
   * unset on a page, so content flows naturally instead of gaining a nested
   * scrollbar.
   */
  panelHeight?: string
  /**
   * Id for the tab list, used to build the ids that link each tab to its panel.
   * Defaults to a generated one, so several instances can coexist on the same
   * page without colliding.
   */
  id?: string
}

/**
 * Tabbed view of a single resource: its attributes, any tabs the caller adds,
 * and its event stream.
 *
 * Usable on its own inside a page, or wrapped in a modal via
 * `useResourceDetailsModal`.
 */
export const ResourceDetailsContent: FC<ResourceDetailsContentProps> = ({
  resource,
  isLoading = false,
  tabs = [],
  panelHeight,
  id,
}) => {
  const generatedId = useId()

  return (
    <Tabs id={id ?? `resource-details${generatedId}`}>
      {[
        <Tab key="attributes" name={t("common.resource_details.attributes")}>
          <TabPanel height={panelHeight}>
            <ResourceAttributes resource={resource} isLoading={isLoading} />
          </TabPanel>
        </Tab>,

        ...tabs.map((tab) => (
          <Tab key={tab.name} name={tab.name}>
            <TabPanel height={panelHeight}>{tab.content(resource)}</TabPanel>
          </Tab>
        )),

        <Tab key="events" name={t("common.resource_details.events")}>
          <TabPanel height={panelHeight}>
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
 * tabs can't resize the container. The gradient strips hint that it scrolls.
 *
 * Styled inline rather than with utility classes: consumers of this library
 * have no Tailwind build of their own, and keeping the height configurable at
 * runtime rules out a static class anyway.
 */
const TabPanel: FC<{ height?: string; children: ReactNode }> = ({
  height,
  children,
}) => {
  if (height == null) {
    return <Spacer top="2">{children}</Spacer>
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ height, overflowY: "auto" }}>
        <div className="pt-2 h-full">{children}</div>
      </div>
      <div className="absolute top-0 left-0 w-full h-2.5 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute -bottom-1 left-0 w-full h-2.5 bg-[linear-gradient(to_top,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]" />
    </div>
  )
}

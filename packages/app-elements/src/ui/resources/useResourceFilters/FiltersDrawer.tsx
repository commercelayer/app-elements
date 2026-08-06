import type { JSX } from "react"
import { t } from "#providers/I18NProvider"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import type { OverlayProps } from "#ui/internals/Overlay"
import { FiltersForm } from "./FiltersForm"
import type { FiltersInstructions } from "./types"

export interface FiltersDrawerProps {
  /**
   * Callback triggered when the user applies the filters.
   * The implementation should update the url query string.
   */
  onUpdate: (newQueryString: string) => void
  /**
   * Title of the drawer
   * @default 'Filters'
   */
  title?: string
}

interface InternalProps {
  instructions: FiltersInstructions
  predicateWhitelist: string[]
  /** Overlay component from the hook, shared with the bar's filters button. */
  Overlay: React.FC<OverlayProps>
  close: () => void
  /** Current url query string, from the hook scope. */
  queryString: string
}

/**
 * Side drawer containing the filters form, opened by the `FiltersBar` filters
 * button.
 *
 * Render it once per page, as a sibling of `FiltersBar`.
 */
export function FiltersDrawer({
  onUpdate,
  title,
  instructions,
  predicateWhitelist,
  Overlay,
  close,
  queryString,
}: FiltersDrawerProps & InternalProps): JSX.Element {
  return (
    <Overlay drawer onBackdropClick={close}>
      <div className="p-6">
        <div className="flex justify-between mb-10">
          <Text weight="semibold" className="text-lg">
            {title ?? t("common.filters")}
          </Text>
          <button type="button" onClick={close} aria-label={t("common.close")}>
            <Icon name="x" weight="bold" />
          </button>
        </div>
        <FiltersForm
          instructions={instructions}
          predicateWhitelist={predicateWhitelist}
          onSubmit={(newQueryString) => {
            onUpdate(preserveViewTitle({ newQueryString, queryString }))
            close()
          }}
        />
      </div>
    </Overlay>
  )
}

FiltersDrawer.displayName = "FiltersDrawer"

/**
 * The filters form has no notion of `viewTitle`, so submitting it would drop the
 * active view (e.g. the selected tab) from the url. Carry it over.
 */
function preserveViewTitle({
  newQueryString,
  queryString,
}: {
  newQueryString: string
  queryString: string
}): string {
  const viewTitle = new URLSearchParams(queryString).get("viewTitle")

  if (viewTitle == null) {
    return newQueryString
  }

  const params = new URLSearchParams(newQueryString)
  params.set("viewTitle", viewTitle)
  return params.toString()
}

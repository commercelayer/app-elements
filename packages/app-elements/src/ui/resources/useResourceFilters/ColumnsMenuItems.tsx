import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import cn from "classnames"
import { type JSX, useEffect, useRef } from "react"
import { t } from "#providers/I18NProvider"
import { Icon } from "#ui/atoms/Icon"
import { DropdownItem } from "#ui/composite/Dropdown"
import {
  applyColumnOrder,
  isColumnVisible,
  type TableColumnEntry,
  type TableSettingsState,
  type TableSettingsStore,
} from "./tableSettings"

/**
 * The items of the columns menu: every column in table order, the hideable ones
 * with a check to show or hide them and a handle to drag them into place, the
 * fixed ones locked where they are.
 *
 * Reordering works with the pointer and with the keyboard: Space or Enter on a
 * handle picks the column up, the arrow keys move it, Space or Enter drops it and
 * Escape puts it back. Each step is announced to screen readers.
 */
export function ColumnsMenuItems({
  store,
  state,
}: {
  store: TableSettingsStore
  state: TableSettingsState
}): JSX.Element {
  const entries = applyColumnOrder(state.columnEntries, {
    getId: (entry) => entry.id,
    isMovable: (entry) => !entry.locked,
    order: state.order,
  })
  const movableIds = entries
    .filter((entry) => !entry.locked)
    .map((entry) => entry.id)

  // A ref rather than state: it has to be current for the very keydown that
  // ends the drag, which `dnd-kit` handles on the document right after us.
  const isDragging = useRef(false)
  // Set by the Escape that cancels a drag, until its keyup: the dropdown closes
  // on keyup, and that one belongs to the drag as well.
  const isCancellingWithEscape = useRef(false)

  const sensors = useSensors(
    // a few pixels of travel before a drag starts, so a click on the handle
    // stays a click
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const announcements = makeAnnouncements(entries, movableIds)

  // a menu closed mid-drag must not leave the page with a grabbing cursor
  useEffect(
    () => () => {
      setGrabbingCursor(false)
    },
    [],
  )

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    isDragging.current = false
    if (over == null || active.id === over.id) {
      return
    }
    store.setColumnOrder(
      arrayMove(
        movableIds,
        movableIds.indexOf(String(active.id)),
        movableIds.indexOf(String(over.id)),
      ),
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: t("common.table_settings.reorder_instructions"),
        },
      }}
      onDragStart={({ activatorEvent }) => {
        isDragging.current = true
        // for the whole pointer drag, wherever the pointer goes: the row is held
        // inside the menu, the pointer is not
        if (activatorEvent instanceof PointerEvent) {
          setGrabbingCursor(true)
        }
      }}
      onDragEnd={(event) => {
        setGrabbingCursor(false)
        handleDragEnd(event)
      }}
      onDragCancel={() => {
        setGrabbingCursor(false)
        isDragging.current = false
      }}
    >
      <SortableContext
        items={movableIds}
        strategy={verticalListSortingStrategy}
      >
        {/* biome-ignore lint/a11y/noStaticElementInteractions: only marks Escape as handled, the handles are the interactive elements */}
        <div
          // Escape while dragging belongs to the drag, which it cancels, and
          // must not also close the menu. Marked rather than stopped: `dnd-kit`
          // listens on the document, so the event still has to get there.
          onKeyDown={(event) => {
            if (isDragging.current && event.key === "Escape") {
              isCancellingWithEscape.current = true
              event.preventDefault()
            }
          }}
          onKeyUp={(event) => {
            if (isCancellingWithEscape.current && event.key === "Escape") {
              isCancellingWithEscape.current = false
              event.preventDefault()
            }
          }}
        >
          {entries.map((entry) =>
            entry.locked ? (
              <LockedColumnItem key={entry.id} entry={entry} />
            ) : (
              <SortableColumnItem
                key={entry.id}
                entry={entry}
                visible={isColumnVisible(entry, state.columns)}
                onToggle={(visible) => {
                  store.setColumnVisible(entry, visible)
                }}
              />
            ),
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}

/**
 * Shows the `grabbing` cursor on the whole page, or restores it.
 *
 * A stylesheet rather than a cursor on `body`: every element under the pointer
 * that sets a cursor of its own — the menu items all have `pointer` — would win
 * over one inherited from the body.
 */
const grabbingStyleId = "cl-table-settings-grabbing"

function setGrabbingCursor(grabbing: boolean): void {
  const current = document.getElementById(grabbingStyleId)
  if (!grabbing) {
    current?.remove()
    return
  }
  if (current != null) {
    return
  }
  const style = document.createElement("style")
  style.id = grabbingStyleId
  style.textContent = "* { cursor: grabbing !important; }"
  document.head.appendChild(style)
}

/** Where the handle sits: inside the item's right padding, centered on its row. */
const handleClassName = "absolute right-3 top-0 bottom-0 flex items-center"

function SortableColumnItem({
  entry,
  visible,
  onToggle,
}: {
  entry: TableColumnEntry
  visible: boolean
  onToggle: (visible: boolean) => void
}): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id })

  return (
    // The whole row drags with the pointer: a click that does not move stays a
    // click and toggles the column, and once a drag has started `dnd-kit`
    // swallows the click that comes with the release. The keyboard drags from
    // the handle only, since Space and Enter on the row toggle the column.
    // `touch-none` keeps a touch drag from scrolling the menu instead.
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      // `dnd-kit` types its listeners as bare functions, keyed by event name
      onPointerDown={
        listeners?.onPointerDown as
          | React.PointerEventHandler<HTMLDivElement>
          | undefined
      }
      // Above its neighbours while it moves, so it slides over them. The hover is
      // the row's, so it holds over the handle too, which sits on top of the
      // item and would otherwise take the hover away from it.
      className={cn(
        "relative touch-none",
        "[&:hover>*:first-child]:bg-gray-100 [&:hover>*:first-child]:rounded",
        { "z-10": isDragging },
      )}
    >
      <DropdownItem
        label={entry.label}
        checked={visible}
        onClick={() => {
          onToggle(!visible)
        }}
        // The row being moved looks hovered, with the item's own shape, and
        // nothing else: a shadow on the full-width row fell outside the item's
        // margins and read as the bottom edge of the menu. Forced, since the
        // pointer can leave the item mid-drag and a keyboard drag has no hover.
        className={cn({ "bg-gray-100! rounded": isDragging })}
      />
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        onKeyDown={
          listeners?.onKeyDown as
            | React.KeyboardEventHandler<HTMLButtonElement>
            | undefined
        }
        aria-label={t("common.table_settings.reorder_column", {
          column: entry.label,
        })}
        className={cn(
          handleClassName,
          // `grab` over the handle only, the one hint that the row can move; the
          // rest of the row keeps the pointer of a click. Pressing here drags the
          // row all the same, the event reaching the row's own listener.
          "flex text-gray-400 rounded cursor-grab",
          // a keyboard user lands here on Tab, and has to see it
          "outline-hidden focus-visible:text-gray-800 focus-visible:bg-gray-100",
        )}
      >
        <Icon name="dotsSixVertical" size={16} />
      </button>
    </div>
  )
}

function LockedColumnItem({ entry }: { entry: TableColumnEntry }): JSX.Element {
  return (
    <div className="relative">
      <DropdownItem
        label={entry.label}
        icon="lockSimple"
        disabled
        aria-disabled
      />
      {/* no handle to grab, only its outline, so the column reads as part of
          the list and stays aligned with the others */}
      <span className={cn(handleClassName, "flex text-gray-200")} aria-hidden>
        <Icon name="dotsSixVertical" size={16} />
      </span>
    </div>
  )
}

/**
 * What screen readers hear while a column is reordered, in terms of column
 * names and positions among the columns that can move, rather than the internal
 * ids `dnd-kit` would read out by default.
 */
function makeAnnouncements(
  entries: TableColumnEntry[],
  movableIds: string[],
): Announcements {
  const label = (id: UniqueIdentifier): string =>
    entries.find((entry) => entry.id === id)?.label ?? String(id)
  const position = (id: UniqueIdentifier): number =>
    movableIds.indexOf(String(id)) + 1
  const total = movableIds.length

  return {
    onDragStart: ({ active }) =>
      t("common.table_settings.reorder_picked_up", {
        column: label(active.id),
      }),
    onDragOver: ({ active, over }) =>
      over == null
        ? undefined
        : t("common.table_settings.reorder_moved", {
            column: label(active.id),
            position: position(over.id),
            total,
          }),
    onDragEnd: ({ active, over }) =>
      over == null
        ? undefined
        : t("common.table_settings.reorder_dropped", {
            column: label(active.id),
            position: position(over.id),
            total,
          }),
    onDragCancel: ({ active }) =>
      t("common.table_settings.reorder_cancelled", {
        column: label(active.id),
      }),
  }
}

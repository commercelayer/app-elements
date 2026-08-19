import cn from "classnames"
import {
  Children,
  createContext,
  type JSX,
  type ReactNode,
  useContext,
} from "react"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"

export type StackSize = "regular" | "small"

export interface StackProps {
  children: ReactNode
  /**
   * How dense the row is.
   *
   * `regular` keeps the page-level rhythm. `small` tightens the padding and, from
   * `@xl` up — where the cells sit side by side — sends the trailing cell to the
   * right edge; stacked, every cell still reads from the left. `StackCell` takes its
   * type sizes from this as well.
   */
  size?: StackSize
}

/** Read by `StackCell`, so a cell matches the row it sits in without being told. */
const StackSizeContext = createContext<StackSize>("regular")

function renderChild(child: ReactNode, size: StackSize): JSX.Element {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-start border-t @xl:border-l border-l-0 @xl:border-t-0 border-gray-100 first:border-l-0 first:border-t-0 print:border-t-0",
        {
          "py-6 @xl:py-2 @xl:px-6 @xl:first:-ml-6 @xl:last:-mr-6":
            size === "regular",
          // The trailing cell reads from the right edge, but only once the cells are
          // side by side: stacked, a right-aligned label would drift away from the
          // value under it. `not-first` leaves a lone cell alone.
          "py-4 @xl:py-1 @xl:px-4 @xl:first:-ml-4 @xl:last:-mr-4 @xl:not-first:last:items-end @xl:not-first:last:text-right":
            size === "small",
        },
      )}
    >
      {child}
    </div>
  )
}

function Stack({
  children,
  size = "regular",
  ...props
}: StackProps): JSX.Element {
  return (
    <div
      {...props}
      // `@container` + `@xl` variants lay the children out side by side based on
      // the width available to the Stack rather than the viewport width, so it
      // stays readable inside narrow containers such as a page sidebar.
      // The 576px threshold sits below the 632px default content width, so a
      // regular page keeps the horizontal layout it has always had.
      className="@container border-t border-b border-gray-100 not-first:-mt-px" // make multiple stack possible even across different siblings
    >
      {/* the vertical padding belongs here, not on the `@container` element: a
          container query is answered by an *ancestor* container, so an `@xl`
          variant on the element that declares `@container` never matches */}
      <div
        className={cn("flex flex-col @xl:flex-row print:flex-row print:gap-4", {
          "@xl:py-6": size === "regular",
          "@xl:py-4": size === "small",
        })}
      >
        <StackSizeContext.Provider value={size}>
          {Children.map(
            children,
            (child) => child != null && renderChild(child, size),
          )}
        </StackSizeContext.Provider>
      </div>
    </div>
  )
}

Stack.displayName = "Stack"

export interface StackCellProps {
  /** Muted caption, above the value. */
  label: string
  /** The value. When empty it renders as a dash, so the row keeps its grid. */
  children?: ReactNode
  /** Overrides the size inherited from the surrounding `Stack`. */
  size?: StackSize
}

/**
 * One cell of a `Stack`: a muted label with its value underneath.
 *
 * The type sizes and the gap follow the `Stack`'s `size`, so a `small` row is small
 * throughout without every call site restating it.
 */
function StackCell({ label, children, size }: StackCellProps): JSX.Element {
  const inheritedSize = useContext(StackSizeContext)
  const resolvedSize = size ?? inheritedSize
  const isSmall = resolvedSize === "small"
  const isEmpty = children == null || children === ""

  return (
    <div>
      <Spacer bottom={isSmall ? "1" : "2"}>
        <Text
          size={isSmall ? "x-small" : "small"}
          tag="div"
          variant="info"
          weight="semibold"
        >
          {label}
        </Text>
      </Spacer>
      <Text
        size={isSmall ? "small" : "regular"}
        tag="div"
        weight="semibold"
        className={isEmpty ? "text-gray-300" : undefined}
      >
        {isEmpty ? "\u2014" : children}
      </Text>
    </div>
  )
}

StackCell.displayName = "StackCell"

export { Stack, StackCell }

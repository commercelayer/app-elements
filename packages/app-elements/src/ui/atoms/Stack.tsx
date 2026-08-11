import { Children, type JSX, type ReactNode } from "react"

export interface StackProps {
  children: ReactNode
}

function renderChild(child: ReactNode): JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-start py-6 @xl:py-2 @xl:px-6 border-t @xl:border-l border-l-0 @xl:border-t-0 border-gray-100 first:border-l-0 first:border-t-0 @xl:first:-ml-6 @xl:last:-mr-6 print:border-t-0">
      {child}
    </div>
  )
}

function Stack({ children, ...props }: StackProps): JSX.Element {
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
      <div className="flex flex-col @xl:py-6 @xl:flex-row print:flex-row print:gap-4">
        {Children.map(children, (child) => child != null && renderChild(child))}
      </div>
    </div>
  )
}

Stack.displayName = "Stack"

export { Stack }

import { Children, type JSX, type ReactNode } from "react"

export interface StackProps {
  children: ReactNode
}

function renderChild(child: ReactNode): JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-start py-6 md:py-2 md:px-6 border-t md:border-l border-l-0 md:border-t-0 border-gray-100 first:border-l-0 first:border-t-0 md:first:-ml-6 md:last:-mr-6">
      {child}
    </div>
  )
}

function Stack({ children, ...props }: StackProps): JSX.Element {
  return (
    <div
      {...props}
      className="border-t border-b border-gray-100 md:py-6 [&:not(:first-child)]:mt-[-1px]" // make multiple stack possible even across different siblings
    >
      <div className="flex flex-col md:flex-row">
        {Children.map(children, (child) => child != null && renderChild(child))}
      </div>
    </div>
  )
}

Stack.displayName = "Stack"
export { Stack }

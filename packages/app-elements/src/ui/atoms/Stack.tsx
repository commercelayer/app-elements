import { Children, type ReactNode } from 'react'

export interface StackProps {
  children: ReactNode
}

function renderChild(child: ReactNode): JSX.Element {
  return (
    <div className='flex-1 flex flex-col items-start py-6 lg:py-2 px-6 border-t lg:border-l border-l-0 lg:border-t-0 border-gray-100 first:border-l-0 first:border-t-0 lg:first:-ml-6 lg:last:-mr-6'>
      {child}
    </div>
  )
}

function Stack({ children, ...props }: StackProps): JSX.Element {
  return (
    <>
      <div
        {...props}
        className='border-t border-b border-gray-100 lg:py-6 [&:not(:first-child)]:mt-[-1px]' // make multiple stack possible even across different siblings
      >
        <div className='flex flex-col md:flex-row'>
          {Children.map(
            children,
            (child) => child != null && renderChild(child)
          )}
        </div>
      </div>
    </>
  )
}

Stack.displayName = 'Stack'
export { Stack }

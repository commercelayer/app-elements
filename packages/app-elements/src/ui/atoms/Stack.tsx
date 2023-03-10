import { Children, ReactNode } from 'react'

export interface StackProps {
  children: ReactNode
}

function renderChild(child: ReactNode): ReactNode {
  return (
    <div className='flex-1 flex flex-col items-start py-2 px-4 border-l border-gray-100 first:border-l-0'>
      {child}
    </div>
  )
}

function Stack({ children, ...props }: StackProps): ReactNode {
  return (
    <div {...props} className='border-t border-b border-gray-100 py-6'>
      <div className='flex'>
        {Children.map(children, (child) => renderChild(child))}
      </div>
    </div>
  )
}

Stack.displayName = 'Stack'
export { Stack }

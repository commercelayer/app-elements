import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
import { Children, Fragment } from 'react'

export interface StackProps {
  children: ElementChildren
  isLoading?: boolean
}

function renderChild(
  child: string | JSX.Element,
  asSkeleton: boolean = false
): JSX.Element {
  return (
    <div className='flex-1 flex flex-col items-start py-2 px-4 border-l border-gray-100 first:border-l-0'>
      {asSkeleton ? (
        <>
          <SkeletonItem className='h-6 w-20' />
          <SkeletonItem className='h-5 w-8 mt-1' />
        </>
      ) : (
        child
      )}
    </div>
  )
}

function Stack({
  isLoading = false,
  children,
  ...rest
}: StackProps): JSX.Element {
  const Wrapper = isLoading ? Skeleton : Fragment

  return (
    <div {...rest} className='border-t border-b border-gray-100 py-6 mb-14'>
      <Wrapper>
        <div className='flex'>
          {Children.map(children, (child) => renderChild(child, isLoading))}
        </div>
      </Wrapper>
    </div>
  )
}

Stack.displayName = 'Stack'
export { Stack }

import cn from 'classnames'
import { Children, cloneElement, FC, isValidElement, ReactElement } from 'react'
import { Simplify } from 'type-fest'
import { DelayShow } from './DelayShow'

const recursiveMap = (
  children: ReactElement,
  fn: (child: JSX.Element) => ReactElement
): ReactElement[] => {
  return Children.map(children, (child) => {
    if (
      isValidElement(child) &&
      (child as JSX.Element).props.children !== undefined
    ) {
      const props = {
        children: recursiveMap((child as JSX.Element).props.children, fn),
        isLoading: true
      }
      child = cloneElement(child, props)
    }

    return fn(child)
  })
}

interface SkeletonTemplateProps {
  /**
   * This prevents `SkeletonTemplate` to appear immediately.
   * It can be used when loading times are too short and you don't want flashing of content
   */
  delayMs?: number
  isLoading?: boolean
  children: ReactElement
}

export function withinSkeleton<P>(
  Element: FC<Simplify<P & { isLoading?: boolean }>>
): FC<Simplify<P & { isLoading?: boolean }>> {
  return (props: Simplify<P & { isLoading?: boolean }>) => {
    const isLoading = props.isLoading ?? false
    const element = Element({ ...props, isLoading })

    if (element != null) {
      return (
        <SkeletonTemplate isLoading={isLoading}>{element}</SkeletonTemplate>
      )
    }

    return element
  }
}

const SkeletonTemplate: FC<SkeletonTemplateProps> = ({
  children,
  isLoading = true,
  delayMs = 500
}) => {
  const skeletonClass =
    'select-none !border-gray-50 pointer-events-none animate-pulse bg-gray-50 rounded text-transparent [&>*]:invisible object-out-of-bounds'

  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <DelayShow delayMs={delayMs}>
      <div data-test-id='skeleton-template'>
        {recursiveMap(children, (child) => {
          if (typeof child !== 'function' && typeof child !== 'object') {
            return <span className={skeletonClass}>{child}</span>
          }

          const props = Object.fromEntries(
            Object.entries(child.props).map(([key, value]) => {
              if (isValidElement(value)) {
                const newValue = (
                  <SkeletonTemplate delayMs={delayMs} isLoading={isLoading}>
                    {value}
                  </SkeletonTemplate>
                )

                return [key, newValue]
              }

              return [key, value]
            })
          )

          if (
            ['Avatar', 'Badge', 'Button', 'Icon', 'RadialProgress'].includes(
              child.type.displayName
            )
          ) {
            return cloneElement(child, {
              ...props,
              className: cn(props.className as string, skeletonClass),
              isLoading: true
            })
          }

          return cloneElement(child, {
            ...props,
            isLoading: true
          })
        })}
      </div>
    </DelayShow>
  )
}

SkeletonTemplate.displayName = 'SkeletonTemplate'
export { SkeletonTemplate }

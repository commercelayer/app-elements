import { Children, cloneElement, isValidElement } from 'react'
import { DelayShow } from './DelayShow'

const recursiveMap = (
  children: ElementChildren,
  fn: (child: string | JSX.Element) => ElementChildren
): ElementChildren[] => {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return fn(child)
    }

    if ((child as JSX.Element).props.children !== undefined) {
      const props = {
        children: recursiveMap((child as JSX.Element).props.children, fn)
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
  children: ElementChildren
}

const SkeletonTemplate = ({
  children,
  delayMs = 500
}: SkeletonTemplateProps): JSX.Element => {
  const skeletonClass =
    'select-none !border-gray-50 pointer-events-none animate-pulse bg-gray-50 rounded text-transparent [&>*]:invisible object-out-of-bounds'

  return (
    <DelayShow delayMs={delayMs}>
      <div data-test-id='skeleton-template'>
        {recursiveMap(children, (child) => {
          if (
            child === null ||
            (typeof child !== 'function' && typeof child !== 'object')
          ) {
            return <span className={skeletonClass}>{child}</span>
          }

          if (
            ['Avatar', 'Badge', 'Button', 'Icon', 'StatusIcon'].includes(
              child.type.displayName
            )
          ) {
            return cloneElement(child, {
              className: skeletonClass
            })
          }

          return child
        })}
      </div>
    </DelayShow>
  )
}

SkeletonTemplate.displayName = 'SkeletonTemplate'
export { SkeletonTemplate }

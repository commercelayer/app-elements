import { isFunctionComponent, isSpecificReactComponent } from '#utils/children'
import cn from 'classnames'
import {
  Children,
  cloneElement,
  FC,
  FunctionComponent,
  isValidElement,
  ReactNode,
  ReactPortal
} from 'react'
import { Simplify } from 'type-fest'
import { useDelayShow } from '../../hooks/useDelayShow'

type ReactNodeNoPortal = Exclude<ReactNode, ReactPortal>

const recursiveMap = (
  children: ReactNodeNoPortal,
  fn: (child: ReactNodeNoPortal) => ReactNodeNoPortal
): ReactNodeNoPortal => {
  return Children.map(children, (child) => {
    if (isValidElement(child) && child.props.children !== undefined) {
      const props = {
        children: recursiveMap(child.props.children, fn)
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
  children: ReactNodeNoPortal
}

export interface SkeletonTemplateComponent<P = {}>
  extends FunctionComponent<P> {
  skeletonTemplate: true
}

export function withinSkeleton<P>(
  Element: FC<Simplify<P & { isLoading?: boolean }>>
): SkeletonTemplateComponent<Simplify<P & { isLoading?: boolean }>> {
  const withinSkeleton: SkeletonTemplateComponent<
    Simplify<P & { isLoading?: boolean }>
  > = (props) => {
    const isLoading = props.isLoading ?? false
    const element = Element({ ...props, isLoading })

    if (element != null) {
      return (
        <SkeletonTemplate data-test-id='we' isLoading={isLoading}>
          {element}
        </SkeletonTemplate>
      )
    }

    return element
  }

  withinSkeleton.displayName = 'withinSkeleton'
  withinSkeleton.skeletonTemplate = true

  return withinSkeleton
}

export function isSkeletonTemplate(child: ReactNode): boolean {
  if (child == null) {
    return false
  }

  return (
    isFunctionComponent(child) &&
    'skeletonTemplate' in child.type &&
    (child.type as SkeletonTemplateComponent).skeletonTemplate
  )
}

const SkeletonTemplate: FC<SkeletonTemplateProps> = ({
  children,
  isLoading = true,
  delayMs = 500
}) => {
  const [show] = useDelayShow(delayMs)
  const skeletonClass =
    'select-none !border-gray-50 pointer-events-none animate-pulse !bg-gray-50 rounded text-transparent [&>*]:invisible object-out-of-bounds'

  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div
      className='select-none pointer-events-none'
      style={{ opacity: show ? undefined : 0 }}
    >
      {recursiveMap(children, (child) => {
        if (child == null) {
          return child
        }

        if (!isValidElement<any>(child)) {
          return <span className={skeletonClass}>{child}</span>
        }

        const props = Object.fromEntries(
          Object.entries(child.props).map(([key, value]) => {
            if (isValidElement(value)) {
              const newValue = (
                <SkeletonTemplate delayMs={0} isLoading={isLoading}>
                  {value}
                </SkeletonTemplate>
              )

              return [key, newValue]
            }

            return [key, value]
          })
        )

        if (
          isSpecificReactComponent(child, [
            'Avatar',
            'Badge',
            'Button',
            'Icon',
            'RadialProgress'
          ])
        ) {
          return cloneElement(child, {
            ...props,
            className: cn(props.className as string, skeletonClass),
            ...(isSkeletonTemplate(child) ? { isLoading: true } : {})
          })
        }

        return cloneElement(child, {
          ...props,
          ...(isSkeletonTemplate(child) ? { isLoading: true } : {})
        })
      })}
    </div>
  )
}

SkeletonTemplate.displayName = 'SkeletonTemplate'
export { SkeletonTemplate }

import cn from "classnames"
import {
  Children,
  cloneElement,
  type FunctionComponent,
  isValidElement,
  type JSX,
  type ReactNode,
  type ReactPortal,
} from "react"
import type { Simplify } from "type-fest"
import {
  filterByDisplayName,
  isFunctionComponent,
  isSpecificReactComponent,
} from "#utils/children"
import { useDelayShow } from "../../hooks/useDelayShow"

type ReactNodeNoPortal = Exclude<Awaited<ReactNode>, ReactPortal>

export type SkeletonTemplateProps<P = Record<string, unknown>> = Simplify<
  P & {
    /**
     * This prevents `SkeletonTemplate` to appear immediately.
     * It can be used when loading times are too short and you don't want flashing of content
     * @default 500
     */
    delayMs?: number
    /**
     * When `true` it shows pulsing gray elements instead of the real content.
     */
    isLoading?: boolean
  }
>

function childrenRecursiveMap(
  children: ReactNodeNoPortal,
  options: SkeletonTemplateProps,
  fn: (child: ReactNodeNoPortal) => ReactNodeNoPortal,
): ReactNodeNoPortal {
  if (Children.count(children) === 1) {
    return childRecursiveMap(children, options, fn)
  }

  return Children.map(children, (child) => {
    if (child instanceof Promise) {
      throw new Error("async/await is not yet supported in SkeletonTemplate")
    }

    return childRecursiveMap(child, options, fn)
  })
}

function childRecursiveMap(
  child: ReactNodeNoPortal,
  options: SkeletonTemplateProps,
  fn: (child: ReactNodeNoPortal) => ReactNodeNoPortal,
): ReactNodeNoPortal {
  if (isValidElement<React.PropsWithChildren>(child)) {
    if (isSkeletonTemplate(child)) {
      return cloneElement(child, {
        isLoading: child.props.isLoading ?? options.isLoading,
        delayMs: child.props.delayMs ?? options.delayMs,
      })
    }

    if (child.props.children != null) {
      return fn(
        cloneElement(child, {
          children: childrenRecursiveMap(
            child.props.children as JSX.Element,
            options,
            fn,
          ),
        }),
      )
    }
  }

  return fn(child)
}

export interface SkeletonTemplateComponent<P = Record<string, unknown>>
  extends FunctionComponent<P> {
  isSkeletonTemplate: true
}

export function withSkeletonTemplate<P>(
  Element: (props: SkeletonTemplateProps<P>) => ReactNode,
): SkeletonTemplateComponent<SkeletonTemplateProps<P>> {
  const withSkeletonTemplate: SkeletonTemplateComponent<
    SkeletonTemplateProps<P>
  > = (props) => {
    const { isLoading, delayMs } = props
    const element = Element({ ...props, isLoading, delayMs })

    if (element instanceof Promise) {
      throw new Error(
        "async/await is not yet supported in withSkeletonTemplate",
      )
    }

    if (element != null) {
      return (
        <SkeletonTemplate isLoading={isLoading} delayMs={delayMs}>
          {element}
        </SkeletonTemplate>
      )
    }

    return element
  }

  withSkeletonTemplate.displayName = "withSkeletonTemplate"
  withSkeletonTemplate.isSkeletonTemplate = true

  return withSkeletonTemplate
}

function isSkeletonTemplate(
  child: ReactNode,
): child is React.ReactElement<
  Pick<SkeletonTemplateProps, "delayMs" | "isLoading">
> {
  if (child == null) {
    return false
  }

  return (
    isFunctionComponent(child) &&
    "isSkeletonTemplate" in child.type &&
    (child.type as SkeletonTemplateComponent).isSkeletonTemplate
  )
}

const SkeletonTemplate: SkeletonTemplateComponent<
  SkeletonTemplateProps<{ children: ReactNodeNoPortal }>
> = ({ children, isLoading, delayMs = 500 }) => {
  const [show] = useDelayShow(delayMs)
  const skeletonClass =
    "select-none border-gray-50! pointer-events-none animate-pulse bg-gray-50! rounded text-transparent *:invisible object-out-of-bounds"

  if (isLoading !== true) {
    return <>{children}</>
  }

  const newChildren = childrenRecursiveMap(
    children,
    {
      isLoading,
      delayMs,
    },
    (child) => {
      if (child == null) {
        return child
      }

      if (typeof child === "string" && child.trim() === "") {
        return child
      }

      if (
        !isValidElement<React.PropsWithChildren<{ className?: string }>>(child)
      ) {
        return <span className={skeletonClass}>{child}</span>
      }

      const props = Object.fromEntries(
        Object.entries(child.props as Record<string, unknown>).map(
          ([key, value]) => {
            if (key !== "children" && isValidElement(value)) {
              const newValue = (
                // biome-ignore lint/correctness/useJsxKeyInIterable: Key is not needed here
                <SkeletonTemplate delayMs={0} isLoading>
                  {value}
                </SkeletonTemplate>
              )

              return [key, newValue]
            }

            return [key, value]
          },
        ),
      )

      if (
        isSpecificReactComponent(child, [
          /^Avatar$/,
          /^AvatarLetter$/,
          /^Badge$/,
          /^Button$/,
          /^A$/,
          /^Icon$/,
          /^StatusIcon$/,
          /^RadialProgress$/,
          /^ButtonFilter$/,
          /^CopyToClipboard$/,
        ])
      ) {
        return cloneElement(child, {
          ...props,
          className: cn(props.className as string, skeletonClass),
        })
      }

      if (isSpecificReactComponent(child, [/^ListItem$/, /^Hr$/])) {
        return cloneElement(child, {
          ...props,
          className: cn(props.className as string, "border-gray-50!"),
        })
      }

      return cloneElement(child, props)
    },
  )

  if (filterByDisplayName(newChildren, /^Tr$/).length > 0) {
    return newChildren
  }

  return (
    <div
      className="select-none pointer-events-none inline"
      style={{ opacity: show ? undefined : 0 }}
    >
      {newChildren}
    </div>
  )
}

SkeletonTemplate.displayName = "SkeletonTemplate"
SkeletonTemplate.isSkeletonTemplate = true
export { SkeletonTemplate }

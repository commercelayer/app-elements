import { isDefined } from '#utils/array'
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode
} from 'react'

export function isFunctionComponent(
  reactNode: ReactNode
): reactNode is ReactElement<any, React.FunctionComponent<any>> {
  return (
    isValidElement(reactNode) &&
    typeof reactNode.type === 'function' &&
    'displayName' in reactNode.type
  )
}

/**
 * Checks if a ReactNode matches a specific component display name.
 * @param reactNode - a ReactNode single child
 * @param displayNames - a list of names of the components we would like to match
 * @returns a boolean value indicating argument match the passed displayNames
 *
 * @example
 * ```jsx
 * React.Children.map(children, (child) =>
 *   isSpecificReactComponent(child, [/^Button$/])
 * )
 * // will return an array of true/false values depending if some child is a button
 * ```
 */

export function isSpecificReactComponent(
  reactNode: ReactNode,
  displayNames: RegExp[]
): reactNode is JSX.Element {
  if (reactNode == null) {
    return false
  }

  return (
    isFunctionComponent(reactNode) &&
    reactNode.type.displayName !== undefined &&
    displayNames.find(
      (rx) =>
        reactNode.type.displayName != null &&
        rx.test(reactNode.type.displayName)
    ) != null
  )
}

export function getInnerText(reactNode: ReactNode): string {
  let buf = ''
  if (reactNode != null) {
    if (typeof reactNode === 'string' || typeof reactNode === 'number') {
      buf += reactNode.toString()
    } else if (typeof reactNode === 'object') {
      let children: ReactNode = null
      if (Array.isArray(reactNode)) {
        children = reactNode
      } else {
        if ('props' in reactNode && reactNode.props != null) {
          children = reactNode.props.children
        }
      }
      if (children != null) {
        if (Array.isArray(children)) {
          children.forEach(function (o: ReactNode) {
            buf += getInnerText(o)
          })
        } else {
          buf += getInnerText(children)
        }
      }
    }
  }

  return buf
}

/**
 * Filter an `Element` looking for all children with the given `displayName`.
 *
 * @example
 * ```tsx
 * filterByDisplayName(children, /^Hooked/)
 * // will return an array of all children with a displayName starting with `Hooked*`
 * ```
 */
export function filterByDisplayName(
  children: React.ReactNode,
  displayName: RegExp
): JSX.Element[] {
  return Children.toArray(children)
    .flatMap((child) => {
      if (
        isValidElement(child) &&
        isSpecificReactComponent(child, [displayName])
      ) {
        return child
      }

      if (isValidElement<any>(child)) {
        if (child.props.children != null) {
          return filterByDisplayName(
            child.props.children as JSX.Element,
            displayName
          )
        }
      }

      return null
    })
    .filter(isDefined)
}

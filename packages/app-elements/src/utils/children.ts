import { isValidElement, type ReactNode } from 'react'

export function isFunctionComponent(
  reactNode: any
): reactNode is { type: React.FunctionComponent<any> } {
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
 *   isSpecificReactComponent(child, ['Button'])
 * )
 * // will return an array of true/false values depending if some child is a button
 * ```
 */

export function isSpecificReactComponent(
  reactNode: ReactNode,
  displayNames: string[]
): boolean {
  if (reactNode == null) {
    return false
  }

  return (
    isFunctionComponent(reactNode) &&
    reactNode.type.displayName !== undefined &&
    displayNames.includes(reactNode.type.displayName)
  )
}

export function getInnerText(reactNode: ReactNode): string {
  let buf = ''
  if (reactNode != null) {
    if (typeof reactNode === 'string' || typeof reactNode === 'number') {
      buf += reactNode.toString()
    } else if (typeof reactNode === 'object') {
      let children = null
      if (Array.isArray(reactNode)) {
        children = reactNode
      } else {
        if ('props' in reactNode && reactNode.props != null) {
          children = reactNode.props.children
        }
      }
      if (children != null) {
        if (Array.isArray(children)) {
          children.forEach(function (o) {
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

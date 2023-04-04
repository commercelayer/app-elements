import { isValidElement, type ReactNode } from 'react'

export function isFunctionComponent(
  child: any
): child is { type: React.FunctionComponent<any> } {
  return (
    isValidElement(child) &&
    typeof child.type === 'function' &&
    'displayName' in child.type
  )
}

/**
 * Checks if a ReactNode matches a specific component display name.
 * @param child - a ReactNode single child
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
  child: ReactNode,
  displayNames: string[]
): boolean {
  if (child == null) {
    return false
  }

  return (
    isFunctionComponent(child) &&
    child.type.displayName !== undefined &&
    displayNames.includes(child.type.displayName)
  )
}

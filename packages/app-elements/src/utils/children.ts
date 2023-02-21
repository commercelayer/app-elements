import { isValidElement } from 'react'

/**
 * Checks if a ReactNode matches a specific component display name.
 * @param child - a ReactNode single child
 * @param displayName - the name of the component we would like to match
 * @returns a boolean values indicating argument match the passed displayName
 *
 *  * Example:
 * ```jsx
 * React.Children.map(children, (child) =>
 *  isSpecificReactComponent(child, 'Button')
 * )
 * // will return an array of true/false values depending if some child is a button
 * ```
 */

export function isSpecificReactComponent(
  child:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined,
  displayName: string
): boolean {
  try {
    if (child == null) {
      return false
    }

    return (
      isValidElement(child) &&
      typeof child.type !== 'string' &&
      'displayName' in child.type &&
      (child.type as any).displayName === displayName
    )
  } catch {
    return false
  }
}

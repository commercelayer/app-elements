import { singular } from 'pluralize'

const resources = await fetch(
  'https://core.commercelayer.io/api/public/resources'
)
  .then<{
    data: Array<{
      id: string
      attributes: {
        fields: Record<string, any>
        relationships: Record<string, any>
      }
    }>
  }>(async (res) => await res.json())
  .then<Record<string, { fields: string[]; relationships: string[] }>>(
    ({ data: resources }) =>
      resources.reduce((acc, cv) => {
        return {
          ...acc,
          [cv.id]: {
            fields: Object.keys(cv.attributes.fields)
              // remove trigger attributes
              .filter((attr) => !attr.startsWith('_')),
            relationships: Object.keys(cv.attributes.relationships)
              // remove trigger attributes
              .filter((attr) => !attr.startsWith('_'))
          }
        }
      }, {})
  )

/**
 *
 * @returns
 */
export async function fetchCoreResourcesSuggestions(
  mainResourceIds: Array<'order' | 'price'>,
  path: string
): Promise<Array<{ value: string; type: 'field' | 'relationship' }>> {
  path = path.replace(/.$/, '')

  if (!new RegExp(`^(${mainResourceIds.join('|')})(.|$)`).test(path)) {
    return mainResourceIds.map((res) => ({
      value: res,
      type: 'relationship'
    }))
  }

  const splittedPath = path.split('.')

  const validPath = splittedPath.reduce<string[]>(
    (acc, cv, index, list) => {
      const parent = list[index - 1]
      if (
        parent != null &&
        resources[singular(parent)]?.relationships.includes(cv) === true
      ) {
        acc.push(cv)
      }

      return acc
    },
    splittedPath[0] != null ? [splittedPath[0]] : []
  )

  const lastValidResource = singular(
    validPath[validPath.length - 1] ?? splittedPath[0] ?? ''
  )

  const suggestions = (
    [] as Array<{ value: string; type: 'field' | 'relationship' }>
  )
    .concat(
      resources[lastValidResource]?.fields.map((a) => ({
        value: `${validPath.join('.')}.${a}`,
        type: 'field'
      })) ?? []
    )
    .concat(
      resources[lastValidResource]?.relationships.map((a) => ({
        value: `${validPath.join('.')}.${a}`,
        type: 'relationship'
      })) ?? []
    )

  return suggestions
}

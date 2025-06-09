/** Response type from https://core.commercelayer.io/api/public/resources */
interface PublicResourcesResponse {
  data: Array<{
    id: string
    type: string
    attributes: {
      fields: Record<
        string,
        {
          type:
            | 'boolean'
            | 'string'
            | 'float'
            | 'datetime'
            | 'object'
            | 'integer'
            | 'array'
            | 'json'
          desc: string
        }
      >
      relationships: Record<
        string,
        {
          type: string
          desc: string
          class_name: string
        }
      >
    }
  }>
}

type FetchResourceResponse = Record<
  string,
  PublicResourcesResponse['data'][number] & {
    fields: ReadonlyArray<
      readonly [
        string,
        PublicResourcesResponse['data'][number]['attributes']['fields'][string]
      ]
    >
    relationships: ReadonlyArray<
      readonly [
        string,
        PublicResourcesResponse['data'][number]['attributes']['relationships'][string]
      ]
    >
  }
>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fetchResources = (() => {
  let cache: FetchResourceResponse

  return async (waitCache = true) => {
    if (waitCache) {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (cache == null) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return cache
    }

    if (cache != null) {
      return cache
    }

    cache = await fetch('https://core.commercelayer.io/api/public/resources')
      .then<PublicResourcesResponse>(async (res) => await res.json())
      .then<PublicResourcesResponse>((json) => {
        return {
          data: json.data
            .concat([
              {
                id: 'inventory',
                type: 'resources',
                attributes: {
                  fields: {
                    available: {
                      type: 'boolean',
                      desc: 'Indicates if the sku is available.'
                    },
                    quantity: {
                      type: 'integer',
                      desc: 'The available stock quantity.'
                    }
                  },
                  relationships: {}
                }
              }
            ])
            .map((item) => {
              if (item.id === 'sku') {
                delete item.attributes.fields.inventory

                return {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    relationships: {
                      ...item.attributes.relationships,
                      inventory: {
                        type: 'has_one',
                        desc: 'The associated inventory.',
                        required: 'required',
                        creatable: true,
                        updatable: true,
                        filterable: true,
                        sortable: true,
                        parent_resource: 'Api::SkuResource',
                        class_name: 'Inventory'
                      }
                    }
                  }
                }
              }

              return item
            })
        }
      })
      .then<FetchResourceResponse>(({ data: resources }) =>
        resources.reduce((acc, cv, index, list) => {
          return {
            ...acc,
            [cv.id]: {
              ...cv,
              fields: Object.entries(cv.attributes.fields)
                // remove trigger attributes
                .filter(([attr]) => !attr.startsWith('_')),
              relationships: Object.entries(cv.attributes.relationships)
                // remove trigger attributes
                .filter(([attr]) => !attr.startsWith('_'))
                // remove polymorphic relationships
                .filter(
                  ([, value]) =>
                    resources.find(
                      (res) => res.id === toSnakeCase(value.class_name)
                    ) != null
                )
            }
          }
        }, {})
      )
      .catch((error) => {
        throw error
      })

    return cache
  }
})()

// Immediately fetch resources to populate the cache
void fetchResources(false)

/**
 *
 * @returns
 */
export async function fetchCoreResourcesSuggestions(
  mainResourceIds: Array<'order' | 'price' | 'price_list'>,
  path: string
): Promise<Array<{ value: string; type: 'field' | 'relationship' }>> {
  if (!new RegExp(`^(${mainResourceIds.join('|')})(.|$)`).test(path)) {
    return mainResourceIds.map((res) => ({
      value: res,
      type: 'relationship'
    }))
  }

  const pathResolved = await atPath(path)

  const suggestions = (
    [] as Array<{ value: string; type: 'field' | 'relationship' }>
  )
    .concat(
      pathResolved.resource?.fields.map(([key]) => ({
        value: `${pathResolved.resourcePath}.${key}`,
        type: 'field'
      })) ?? []
    )
    .concat(
      pathResolved.resource?.relationships.map(([key]) => ({
        value: `${pathResolved.resourcePath}.${key}`,
        type: 'relationship'
      })) ?? []
    )

  return suggestions
}

export async function atPath(
  path: string,
  obj?: FetchResourceResponse[string]
): Promise<{
  path: string
  field?: FetchResourceResponse[string]['fields'][number][1]
  resourcePath: string
  resource?: FetchResourceResponse[string]
  // resource?: {
  //   fields: ReadonlyArray<readonly [string, { desc: string }]>
  //   relationships: ReadonlyArray<
  //     readonly [string, { desc: string; class_name: string }]
  //   >
  // }
}> {
  const resources = await fetchResources()
  const splittedPath = path.replace(/\.$/, '').split('.')

  const mainResourceId = splittedPath.shift()

  obj ??= resources[mainResourceId ?? '']

  return splittedPath.reduce<Awaited<ReturnType<typeof atPath>>>(
    (acc, attr) => {
      const className = acc.resource?.relationships.find(
        ([key]) => key === attr
      )?.[1].class_name

      if (className == null) {
        const field = acc.resource?.fields.find(([key]) => key === attr)?.[1]

        return {
          ...acc,
          field:
            field != null
              ? {
                  ...field,
                  name: attr
                }
              : undefined
        }
      }

      const obj = resources[toSnakeCase(className)]

      if (obj == null) {
        return acc
      }

      return {
        path: acc.path,
        resourcePath: `${acc.resourcePath == null ? '' : `${acc.resourcePath}.`}${attr}`,
        resource: obj
      }
    },
    {
      path,
      resourcePath: obj != null ? (mainResourceId ?? '') : '',
      resource: obj
    }
  )
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .toLowerCase()
}

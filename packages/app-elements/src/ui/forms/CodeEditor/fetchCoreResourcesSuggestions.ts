// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetchResources = (() => {
  let cache: Record<
    string,
    {
      fields: ReadonlyArray<
        readonly [
          string,
          {
            desc: string
          }
        ]
      >
      relationships: ReadonlyArray<
        readonly [
          string,
          {
            desc: string
            class_name: string
          }
        ]
      >
    }
  >

  return async () => {
    if (cache != null) {
      return cache
    }

    cache = await fetch('https://core.commercelayer.io/api/public/resources')
      .then<{
        data: Array<{
          id: string
          attributes: {
            fields: Record<
              string,
              {
                desc: string
              }
            >
            relationships: Record<
              string,
              {
                desc: string
                class_name: string
              }
            >
          }
        }>
      }>(async (res) => await res.json())
      .then<
        Record<
          string,
          {
            fields: ReadonlyArray<readonly [string, { desc: string }]>
            relationships: ReadonlyArray<
              readonly [string, { desc: string; class_name: string }]
            >
          }
        >
      >(({ data: resources }) =>
        resources.reduce((acc, cv, index, list) => {
          return {
            ...acc,
            [cv.id]: {
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
      pathResolved.obj?.fields.map(([key]) => ({
        value: `${pathResolved.path}.${key}`,
        type: 'field'
      })) ?? []
    )
    .concat(
      pathResolved.obj?.relationships.map(([key]) => ({
        value: `${pathResolved.path}.${key}`,
        type: 'relationship'
      })) ?? []
    )

  return suggestions
}

export async function atPath(
  path: string,
  obj?: {
    fields: ReadonlyArray<readonly [string, { desc: string }]>
    relationships: ReadonlyArray<
      readonly [string, { desc: string; class_name: string }]
    >
  }
): Promise<{
  path: string
  obj?: {
    fields: ReadonlyArray<readonly [string, { desc: string }]>
    relationships: ReadonlyArray<
      readonly [string, { desc: string; class_name: string }]
    >
  }
}> {
  const resources = await fetchResources()
  const splittedPath = path.replace(/\.$/, '').split('.')

  const mainResourceId = splittedPath.shift()

  obj ??= resources[mainResourceId ?? '']

  return splittedPath.reduce(
    (acc, attr) => {
      const className = acc.obj?.relationships.find(
        ([key]) => key === attr
      )?.[1].class_name

      if (className == null) {
        return acc
      }

      const obj = resources[toSnakeCase(className)]

      if (obj == null) {
        return acc
      }

      return {
        path: `${acc.path == null ? '' : `${acc.path}.`}${attr}`,
        obj
      }
    },
    { path: obj != null ? (mainResourceId ?? '') : '', obj }
  )
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .toLowerCase()
}

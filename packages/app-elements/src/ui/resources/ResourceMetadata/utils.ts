export const updatableTypes = ["string", "number", "boolean"] as const
export type UpdatableType = (typeof updatableTypes)[number]

export const isUpdatableType = (value: any): value is UpdatableType => {
  return updatableTypes.includes(typeof value as UpdatableType)
}

export function groupMetadataKeys(
  data: Array<{ key: string; value?: unknown }>,
): GroupedMetadataKeys {
  const result = data.reduce<GroupedMetadataKeys>((acc, cv, i) => {
    const a = {
      ...acc,
      [cv.key]: {
        count: (acc[cv.key]?.count ?? 0) + 1,
        indexes: (acc[cv.key]?.indexes ?? []).concat(i),
      },
    }
    return a
  }, {})

  return result
}

type GroupedMetadataKeys = Record<
  string,
  {
    count: number
    indexes: number[]
  }
>

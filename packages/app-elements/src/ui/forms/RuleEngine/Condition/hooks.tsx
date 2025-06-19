import { atPath } from '#ui/forms/CodeEditor/fetchCoreResourcesSuggestions'
import { useEffect, useState } from 'react'
import { type SchemaConditionItem } from '../utils'

export function useResourcePathInfos(item: SchemaConditionItem | null): {
  infos: Awaited<ReturnType<typeof atPath>> | undefined
} {
  const [infos, setInfos] = useState<
    Awaited<ReturnType<typeof atPath>> | undefined
  >(undefined)

  useEffect(() => {
    if (item?.field != null) {
      atPath(item.field)
        .then((result) => {
          setInfos(result)
        })
        .catch((error) => {
          console.error('Error fetching field info:', error)
        })
    }
  }, [item?.field])

  return { infos }
}

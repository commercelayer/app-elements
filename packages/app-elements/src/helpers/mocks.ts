import type { Resource } from "@commercelayer/sdk"

export const isMockedId = (id: string): boolean => {
  return id.startsWith("fake-")
}

export const isMock = (resource: Resource): boolean => {
  return isMockedId(resource.id)
}

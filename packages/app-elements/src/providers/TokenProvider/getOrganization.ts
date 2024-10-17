import { getCoreApiBaseEndpoint } from '@commercelayer/js-auth'
import { type Organization } from '@commercelayer/sdk'
import fetch from 'cross-fetch'

export async function getOrganization({
  accessToken
}: {
  accessToken: string
}): Promise<Organization | null> {
  try {
    const apiBaseEndpoint = getCoreApiBaseEndpoint(accessToken)
    const response = await fetch(`${apiBaseEndpoint}/api/organization`, {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken}` }
    })
    const organization = await response.json()
    return organization?.data?.attributes ?? null
  } catch {
    return null
  }
}

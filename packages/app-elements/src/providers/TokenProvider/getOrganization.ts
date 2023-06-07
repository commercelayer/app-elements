import { type Organization } from '@commercelayer/sdk'
import fetch from 'cross-fetch'

export async function getOrganization({
  accessToken,
  organizationSlug,
  domain
}: {
  accessToken: string
  organizationSlug: string
  domain: string
}): Promise<Organization | null> {
  try {
    const response = await fetch(
      `https://${organizationSlug}.${domain}/api/organization`,
      {
        method: 'GET',
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    const organization = await response.json()
    return organization?.data?.attributes ?? null
  } catch {
    return null
  }
}

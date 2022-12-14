export function getOrgSlugFromCurrentUrl(): string {
  return window.location.hostname.split('.')[0]
}

export function makeDashboardUrl(): string {
  return `https://dashboard.commercelayer.io/${getOrgSlugFromCurrentUrl()}`
}

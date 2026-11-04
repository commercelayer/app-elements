/**
 * The part of an organization this reads: the organization-level feature flags,
 * which both the Provisioning and the Core organization carry (`api_rules_engine`
 * and the like). Structural, so either SDK's `Organization` can be passed as is.
 */
type OrganizationWithFlags = object

/**
 * Whether B2B agreements are switched on for a seller organization.
 *
 * Everything seller-side about agreements goes through this — the Agreements
 * section of the dashboard, and every agreement feature in the dashboard apps —
 * so that turning them on per organization is a change here and nowhere else.
 *
 * Read from the organization's `agreements.enabled` feature (core_mixins'
 * `feature_defaults`), an add-on off by default, which the organization carries
 * as `agreements_enabled` — the way `discount_engines.enabled` comes through as
 * `discount_engines_enabled`. Read by name rather than through the SDK type,
 * which predates the flag. An organization not loaded yet, or one without the
 * attribute, has agreements off.
 *
 * The dashboard calls this and hands the answer to every app it mounts, as
 * `extras.organization.isAgreementsEnabled` on the token provider — the same way
 * it passes `isEnterprise` — so the apps never call it themselves.
 *
 * The buyer side does not ask: a buyer organization's shell follows from its
 * own metadata, not from a seller's flag.
 */
export function isAgreementsEnabled(
  organization: OrganizationWithFlags | null | undefined,
): boolean {
  return (
    organization != null &&
    "agreements_enabled" in organization &&
    organization.agreements_enabled === true
  )
}

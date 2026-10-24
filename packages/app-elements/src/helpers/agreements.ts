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
 * Agreements will be an organization-level feature flag like the rules engine's
 * `api_rules_engine`, read from the organization passed in. The flag does not
 * exist yet, so for now every organization has them.
 *
 * The dashboard calls this and hands the answer to every app it mounts, as
 * `extras.organization.isAgreementsEnabled` on the token provider — the same way
 * it passes `isEnterprise` — so the apps never call it themselves.
 *
 * The buyer side does not ask: a buyer organization's shell follows from its
 * own metadata, not from a seller's flag.
 */
export function isAgreementsEnabled(
  // read once the flag exists; kept in the signature so callers already pass it
  _organization: OrganizationWithFlags | null | undefined,
): boolean {
  return true
}

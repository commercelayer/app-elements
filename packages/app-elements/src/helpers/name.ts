import isEmpty from "lodash-es/isEmpty"

/**
 * Make a display name from first and last name in the format of
 * "J. Doe" or "Doe" if first name is empty
 */
export function formatDisplayName(
  firstName: string,
  lastName?: string,
): string {
  if (isEmpty(firstName) && isEmpty(lastName)) {
    return ""
  }

  if (firstName == null || isEmpty(firstName)) {
    return lastName ?? ""
  }

  if (lastName == null || isEmpty(lastName)) {
    return firstName ?? ""
  }

  if (firstName.length === 1) {
    return `${firstName} ${lastName}`
  }

  return `${firstName.charAt(0)}. ${lastName}`
}

/**
 * Make a full name from first and last name in the format
 */
export function computeFullname(firstName: string, lastName?: string): string {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim()
}

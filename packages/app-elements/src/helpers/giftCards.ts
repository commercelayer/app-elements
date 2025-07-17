export function maskGiftCardCode(code?: string | null): string {
  if (code == null || code === "") {
    return "N/A"
  }

  if (code.length <= 8) {
    return code
  }

  return `··${code.slice(-8)}`
}

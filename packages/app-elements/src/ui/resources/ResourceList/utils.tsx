export function computeTitleWithTotalCount({
  title,
  recordCount,
  locale
}: {
  title?: React.ReactNode
  recordCount?: number
  locale?: string
}): React.ReactNode {
  if (typeof title !== 'string' || recordCount == null || recordCount === 0) {
    return title
  }

  return `${title} · ${Intl.NumberFormat(locale).format(recordCount)}`
}

import omit from "lodash-es/omit"
import type { JSX } from "react"

export function enforceAllowedTags<
  AllowedTags extends ReadonlyArray<keyof JSX.IntrinsicElements>,
  Tag extends AllowedTags[number],
  DefaultTag extends AllowedTags[number],
>({
  tag,
  allowedTags,
  defaultTag,
}: {
  tag?: Tag
  allowedTags: AllowedTags
  defaultTag: DefaultTag
}): Tag | DefaultTag {
  return tag != null && allowedTags.includes(tag) ? tag : defaultTag
}

export function removeUnwantedProps<P extends object, U extends keyof P>(
  props: P,
  unwantedProps: U[],
): Omit<P, (typeof unwantedProps)[number]> {
  return omit(props, unwantedProps) as Omit<P, (typeof unwantedProps)[number]>
}

export function enforceAllowedTags<
  AllowedTags extends ReadonlyArray<keyof JSX.IntrinsicElements>,
  Tag extends AllowedTags[number],
  DefaultTag extends AllowedTags[number]
>({
  tag,
  allowedTags,
  defaultTag
}: {
  tag?: Tag
  allowedTags: AllowedTags
  defaultTag: DefaultTag
}): Tag | DefaultTag {
  return tag != null && allowedTags.includes(tag) ? tag : defaultTag
}

export function removeTagProp<T extends object>(props: T): Omit<T, 'tag'> {
  return {
    ...props,
    tag: undefined
  }
}

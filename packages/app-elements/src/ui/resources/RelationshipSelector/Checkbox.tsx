import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { InputCheckbox, type InputCheckboxProps } from '#ui/forms/InputCheckbox'
import { type CommerceLayerClient } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'

export interface CheckboxItem {
  value: string
  label: string
}

interface CheckboxProps
  extends Pick<InputCheckboxProps, 'checked' | 'onChange'> {
  item: CheckboxItem
}

export function Checkbox({
  item,
  checked,
  onChange
}: CheckboxProps): JSX.Element {
  const isLoading = item.value === '' // is mock
  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      <InputCheckbox onChange={onChange} checked={checked}>
        <AvatarLetter text={item.label} />
        <Text weight='semibold'>{item.label}</Text>
      </InputCheckbox>
    </SkeletonTemplate>
  )
}

type Resource = Awaited<
  ReturnType<CommerceLayerClient[ListableResourceType]['list']>
>[number]

export function prepareCheckboxItemOrMock({
  resource,
  isLoading,
  fieldForLabel,
  fieldForValue
}: {
  resource?: Resource
  isLoading?: boolean
  fieldForValue: string
  fieldForLabel: string
}): CheckboxItem {
  const getAttribute = (attribute: string): string =>
    resource == null
      ? ''
      : ((resource[attribute as keyof Resource] ?? '') as string)

  return isLoading === true || resource == null
    ? // mock
      {
        value: '',
        label: 'Commerce Layer'
      }
    : // real
      {
        value: getAttribute(fieldForValue),
        label: getAttribute(fieldForLabel)
      }
}

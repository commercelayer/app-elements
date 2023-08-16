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
  showIcon?: boolean
}

export function Checkbox({
  item,
  showIcon,
  checked,
  onChange
}: CheckboxProps): JSX.Element {
  const isLoading = item.value === '' // is mock
  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      <div className='p-3 hover:bg-gray-50 mb-[1px] last:mb-0'>
        <InputCheckbox
          onChange={onChange}
          checked={checked}
          icon={
            showIcon != null && showIcon ? (
              <AvatarLetter text={item.label} />
            ) : undefined
          }
        >
          <Text weight='semibold'>{item.label}</Text>
        </InputCheckbox>
      </div>
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

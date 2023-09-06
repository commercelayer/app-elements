import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import {
  InputCheckbox,
  type InputCheckboxProps
} from '#ui/forms/InputCheckbox/InputCheckbox'
import { type CommerceLayerClient } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { useRef } from 'react'

export interface CheckboxItem {
  value: string
  label: string
}

interface CheckboxProps
  extends Pick<InputCheckboxProps, 'checked' | 'onChange'> {
  item: CheckboxItem
  showIcon?: boolean
  hasBottomMargin?: boolean
}

export function Checkbox({
  item,
  showIcon,
  checked,
  onChange
}: CheckboxProps): JSX.Element {
  const isLoading = item.value === '' // is mock
  const checkbox = useRef<HTMLInputElement>(null)

  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      <div
        className='rounded p-3 hover:bg-gray-50 mb-[1px] last:mb-0 cursor-pointer'
        onClick={(e) => {
          if (checkbox.current != null) {
            checkbox.current.click()
            checkbox.current.focus()
          }
        }}
      >
        <InputCheckbox
          onChange={onChange}
          checked={checked}
          icon={
            showIcon != null && showIcon ? (
              <AvatarLetter text={item.label} />
            ) : undefined
          }
          ref={checkbox}
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

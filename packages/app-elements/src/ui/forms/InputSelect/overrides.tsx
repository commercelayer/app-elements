import { Hr } from '#ui/atoms/Hr'
import { Spacer } from '#ui/atoms/Spacer'
import { Tag } from '#ui/atoms/Tag'
import { X } from '@phosphor-icons/react'
import { castArray } from 'lodash-es'
import { type JSX } from 'react'
import {
  components,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type GroupHeadingProps,
  type MenuListProps,
  type MultiValueGenericProps
} from 'react-select'
import { type InputSelectValue } from '.'

function DropdownIndicator(
  props: DropdownIndicatorProps<InputSelectValue>
): JSX.Element {
  return (
    <components.DropdownIndicator {...props} className='p-0'>
      <button type='button' className='px-2 cursor-pointer'>
        <svg
          width='16'
          height='14'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M4.107 4.902a.314.314 0 0 1 0-.471l3.636-3.333a.387.387 0 0 1 .514 0l3.636 3.333a.314.314 0 0 1 0 .471.387.387 0 0 1-.514 0L8 1.805 4.62 4.902a.387.387 0 0 1-.513 0ZM11.893 9.098a.314.314 0 0 1 0 .471l-3.636 3.333a.388.388 0 0 1-.514 0L4.107 9.57a.314.314 0 0 1 0-.471.387.387 0 0 1 .514 0L8 12.195l3.38-3.097a.387.387 0 0 1 .513 0Z'
            fill={props.isDisabled ? '#DBDCDC' : '#101111'}
            stroke={props.isDisabled ? '#DBDCDC' : '#101111'}
            strokeWidth='.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </components.DropdownIndicator>
  )
}

function ClearIndicator(
  props: ClearIndicatorProps<InputSelectValue>
): JSX.Element {
  return (
    <components.ClearIndicator {...props} className='p-0'>
      <button type='button' className='px-2 cursor-pointer'>
        <X />
      </button>
    </components.ClearIndicator>
  )
}

function MultiValueContainer(
  props: MultiValueGenericProps<
    MultiValueGenericProps<
      InputSelectValue,
      boolean,
      GroupBase<InputSelectValue>
    >
  >
): JSX.Element {
  return <Tag>{props.children}</Tag>
}

function MultiValueLabel(
  props: MultiValueGenericProps<
    MultiValueGenericProps<
      InputSelectValue,
      boolean,
      GroupBase<InputSelectValue>
    >
  >
): string {
  return props.data.label
}

function MultiValueRemove(props: any): JSX.Element {
  return (
    <button {...props.innerProps} className='cursor-pointer -mr-2 rounded'>
      <X weight='bold' />
    </button>
  )
}

function GroupHeading(
  props: GroupHeadingProps<InputSelectValue>
): JSX.Element | null {
  // Since is not exposed in the props, we need to get the index of the current group
  // by finding  options of the current group (props.data.options) with the options of the selectProps
  const idx = props.selectProps.options.findIndex(
    (group) =>
      'options' in group &&
      group.options.every((option) => {
        const currentGroupValues = props.data.options.map((o) => o.value)
        return currentGroupValues.includes(option.value)
      })
  )

  // checking if all values in the previous group are selected,
  // in that case we don't need the separator since the previous group is empty
  const prevGroup = props.selectProps.options[idx - 1]
  const prevGroupIsEmpty =
    prevGroup != null &&
    'options' in prevGroup &&
    prevGroup.options.every((o) =>
      castArray(props.selectProps.value).includes(o)
    )

  // no separator for the first group
  if ((props.data.label == null && idx === 0) || prevGroupIsEmpty) {
    return null
  }

  if (props.data.label == null) {
    return (
      <Spacer bottom='4'>
        <Hr />
      </Spacer>
    )
  }

  // standard group heading when label exists
  return <components.GroupHeading {...props} />
}

function MenuList(props: MenuListProps<InputSelectValue>): JSX.Element {
  // @ts-expect-error `isLoading` is missing in type definitions
  const isLoading = Boolean(props.isLoading)
  // @ts-expect-error I found no way to enhance `props.selectProps` definitions with custom ones specified in our wrapped `InputSelect` component
  const menuFooterText = props.selectProps.menuFooterText as string | undefined

  return (
    <components.MenuList {...props}>
      {props.children}
      {menuFooterText != null && !isLoading && props.options.length > 0 ? (
        <div className='px-4 py-2 text-sm text-gray-500'>{menuFooterText}</div>
      ) : null}
    </components.MenuList>
  )
}

const selectComponentOverrides = {
  DropdownIndicator,
  IndicatorSeparator: () => null,
  ClearIndicator,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  GroupHeading,
  MenuList
}

export default selectComponentOverrides

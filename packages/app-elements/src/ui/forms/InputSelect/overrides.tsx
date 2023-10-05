import { Tag } from '#ui/atoms/Tag'
import { X } from '@phosphor-icons/react'
import {
  components,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type MultiValueGenericProps,
  type MultiValueRemoveProps
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
  return <Tag tag='div'>{props.children}</Tag>
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

function MultiValueRemove(
  props: MultiValueRemoveProps<InputSelectValue>
): JSX.Element {
  return (
    <div {...props.innerProps} className='cursor-pointer py-1 px-2 -mx-2'>
      <X weight='bold' />
    </div>
  )
}

const selectComponentOverrides = {
  DropdownIndicator,
  IndicatorSeparator: () => null,
  ClearIndicator,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove
}

export default selectComponentOverrides

import { XIcon } from "@phosphor-icons/react"
import cn from "classnames"
import { castArray } from "lodash-es"
import { type JSX, useEffect, useRef, useState } from "react"
import {
  type ClearIndicatorProps,
  type ControlProps,
  components,
  type DropdownIndicatorProps,
  type GroupBase,
  type GroupHeadingProps,
  type InputProps,
  type MenuListProps,
  type MultiValueGenericProps,
  type SingleValueProps,
  type ValueContainerProps,
} from "react-select"
import { Hr } from "#ui/atoms/Hr"
import { Spacer } from "#ui/atoms/Spacer"
import { Tag } from "#ui/atoms/Tag"
import { Tooltip } from "#ui/atoms/Tooltip"
import type { InputSelectValue } from "."

function DropdownIndicator(
  props: DropdownIndicatorProps<InputSelectValue>,
): JSX.Element {
  return (
    <components.DropdownIndicator {...props} className="p-0">
      <button type="button" className="px-2 cursor-pointer">
        {/** biome-ignore lint/a11y/noSvgWithoutTitle: Don't need to add a title */}
        <svg
          width="12"
          height="auto"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.107 4.902a.314.314 0 0 1 0-.471l3.636-3.333a.387.387 0 0 1 .514 0l3.636 3.333a.314.314 0 0 1 0 .471.387.387 0 0 1-.514 0L8 1.805 4.62 4.902a.387.387 0 0 1-.513 0ZM11.893 9.098a.314.314 0 0 1 0 .471l-3.636 3.333a.388.388 0 0 1-.514 0L4.107 9.57a.314.314 0 0 1 0-.471.387.387 0 0 1 .514 0L8 12.195l3.38-3.097a.387.387 0 0 1 .513 0Z"
            fill={props.isDisabled ? "#DBDCDC" : "#101111"}
            stroke={props.isDisabled ? "#DBDCDC" : "#101111"}
            strokeWidth=".8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </components.DropdownIndicator>
  )
}

function ClearIndicator(
  props: ClearIndicatorProps<InputSelectValue>,
): JSX.Element {
  return (
    <components.ClearIndicator {...props} className="p-0">
      <button type="button" className="px-2 cursor-pointer">
        <XIcon />
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
  >,
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
  >,
) {
  return props.data.label
}

function MultiValueRemove(props: any): JSX.Element {
  return (
    <button
      {...props.innerProps}
      className="cursor-pointer rounded text-gray-400"
    >
      <XIcon weight="bold" />
    </button>
  )
}

function GroupHeading(
  props: GroupHeadingProps<InputSelectValue>,
): JSX.Element | null {
  // Since is not exposed in the props, we need to get the index of the current group
  // by finding  options of the current group (props.data.options) with the options of the selectProps
  const idx = props.selectProps.options.findIndex(
    (group) =>
      "options" in group &&
      group.options.every((option) => {
        const currentGroupValues = props.data.options.map((o) => o.value)
        return currentGroupValues.includes(option.value)
      }),
  )

  // checking if all values in the previous group are selected,
  // in that case we don't need the separator since the previous group is empty
  const prevGroup = props.selectProps.options[idx - 1]
  const prevGroupIsEmpty =
    prevGroup != null &&
    "options" in prevGroup &&
    prevGroup.options.every((o) =>
      castArray(props.selectProps.value).includes(o),
    )

  // no separator for the first group
  if ((props.data.label == null && idx === 0) || prevGroupIsEmpty) {
    return null
  }

  if (props.data.label == null) {
    return (
      <Spacer bottom="4">
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
        <div className="px-4 py-2 text-sm text-gray-500">{menuFooterText}</div>
      ) : null}
    </components.MenuList>
  )
}

function MenuPortal(props: any): JSX.Element {
  return (
    <components.MenuPortal
      {...props}
      getStyles={(k, p) => ({
        ...props.getStyles(k, p),
        zIndex: 100,
      })}
    >
      {props.children}
    </components.MenuPortal>
  )
}

function Input(props: InputProps<InputSelectValue>): JSX.Element {
  const newProps = {
    ...props,
    // `.no-focus` prevents applying default styles from global.css
    inputClassName: cn(props.inputClassName, "no-focus"),
  }
  return <components.Input {...newProps} />
}

function isEllipsisActive(e: HTMLElement): boolean {
  return e.offsetWidth < e.scrollWidth
}

function Control(props: ControlProps<InputSelectValue>): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState<string | null>(null)

  useEffect(() => {
    if (ref.current != null) {
      const singleValueElement = ref.current.querySelector(".single-value")
      if (
        props.selectProps.isMulti === false &&
        singleValueElement != null &&
        singleValueElement instanceof HTMLElement &&
        isEllipsisActive(singleValueElement)
      ) {
        setTitle(singleValueElement.innerText)
      } else {
        setTitle(null)
      }
    }
  }, [ref, props.selectProps.value])

  const newProps = {
    ...props,
  }

  return (
    <div ref={ref}>
      <Tooltip content={title} label={<components.Control {...newProps} />} />
    </div>
  )
}

function ValueContainer(
  props: ValueContainerProps<InputSelectValue>,
): JSX.Element {
  const newProps = {
    ...props,
  }

  return <components.ValueContainer {...newProps} />
}

function SingleValue(props: SingleValueProps<InputSelectValue>): JSX.Element {
  const newProps = {
    ...props,
    className: cn(props.className, "single-value"),
  }

  return <components.SingleValue {...newProps} />
}

const selectComponentOverrides = {
  DropdownIndicator,
  IndicatorSeparator: () => null,
  ClearIndicator,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  GroupHeading,
  MenuList,
  MenuPortal,
  Input,
  Control,
  ValueContainer,
  SingleValue,
}

export default selectComponentOverrides

import cn from "classnames"
import debounce from "lodash-es/debounce"
import isEmpty from "lodash-es/isEmpty"
import type { AsyncAdditionalProps } from "node_modules/react-select/dist/declarations/src/useAsync"
import type React from "react"
import { forwardRef, useCallback, useEffect, useState } from "react"
import type {
  GroupBase,
  InputActionMeta,
  InputProps,
  MultiValue,
  SelectInstance,
  SingleValue,
  StylesConfig,
} from "react-select"
import type AsyncSelect from "react-select/async"
import type AsyncCreatableSelect from "react-select/async-creatable"
import type { SetRequired } from "type-fest"
import type {
  GroupedSelectValues,
  InputSelectProps,
  InputSelectValue,
} from "./InputSelect"
import components from "./overrides"
import { isSingleValueSelected } from "./utils"

export interface GenericAsyncSelectComponentProps
  extends Omit<
    SetRequired<InputSelectProps, "loadAsyncValues">,
    "label" | "hint"
  > {
  styles: StylesConfig<InputSelectValue>
}

// extracting loadOptions signature from react-select async types
type ReactSelectLoadOptions = Exclude<
  AsyncAdditionalProps<
    InputSelectValue,
    GroupBase<InputSelectValue>
  >["loadOptions"],
  undefined
>

export const GenericAsyncSelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  GenericAsyncSelectComponentProps & {
    SelectComponent: AsyncSelect | AsyncCreatableSelect
  }
>(
  (
    {
      onSelect,
      noOptionsMessage,
      initialValues,
      isOptionDisabled,
      loadAsyncValues,
      SelectComponent,
      asTextSearch = false,
      debounceMs = 500,
      ...rest
    },
    ref,
  ) => {
    const loadOptions = useCallback(
      debounce<ReactSelectLoadOptions>((inputText, callback) => {
        void loadAsyncValues(inputText).then((options) => {
          callback(options)
        })
      }, debounceMs),
      [debounceMs],
    )

    const textSearchProps = useTextSearch({
      onSelect,
      defaultValue: rest.defaultValue,
      value: rest.value,
      initialValues,
      loadAsyncValues,
    })

    useEffect(() => {
      return () => {
        loadOptions.cancel()
      }
    }, [debounceMs])

    return (
      <SelectComponent
        {...rest}
        ref={ref}
        closeMenuOnSelect={rest.isMulti !== true}
        createOptionPosition="first"
        allowCreateWhileLoading
        noOptionsMessage={({ inputValue }) =>
          isEmpty(inputValue) &&
          (initialValues === undefined || initialValues.length === 0)
            ? null
            : noOptionsMessage
        }
        loadOptions={loadOptions}
        isOptionDisabled={isOptionDisabled}
        formatCreateLabel={(v) => v} // to override default `Create "${value}"`
        {...(asTextSearch === true
          ? textSearchProps
          : {
              defaultOptions: initialValues,
              onChange: onSelect,
              components: {
                ...components,
                DropdownIndicator: null,
              },
            })}
      />
    )
  },
)

function useTextSearch(
  props: Pick<
    GenericAsyncSelectComponentProps,
    "defaultValue" | "value" | "onSelect" | "loadAsyncValues" | "initialValues"
  >,
) {
  const [value, setValue] = useState<
    InputSelectValue | InputSelectValue[] | undefined
  >(
    props.defaultValue != null && isSingleValueSelected(props.defaultValue)
      ? props.defaultValue
      : props.value,
  )

  const [inputValue, setInputValue] = useState(
    value != null && isSingleValueSelected(value) ? value.label : "",
  )

  const onChange = (
    newValue: SingleValue<InputSelectValue> | MultiValue<InputSelectValue>,
  ) => {
    if (isSingleValueSelected(newValue)) {
      setValue(newValue)
      setInputValue(newValue ? newValue.label : "")
    }

    props.onSelect(newValue)
  }

  const onInputChange = (inputValue: string, { action }: InputActionMeta) => {
    // onBlur => setInputValue to last selected value
    if (action === "input-blur") {
      if (value != null && isSingleValueSelected(value)) {
        setInputValue(value ? value.label : "")
        setValue(value)
      }
    }

    if (action === "input-change") {
      // onInputChange => update inputValue
      setInputValue(inputValue)

      void props.loadAsyncValues(inputValue).then((results) => {
        setDefaultOptions(results)
      })
    }
  }

  const [defaultOptions, setDefaultOptions] = useState<
    GroupedSelectValues | InputSelectValue[] | undefined
  >(props.initialValues)

  return {
    onMenuOpen: () => {
      void props.loadAsyncValues(inputValue).then((results) => {
        setDefaultOptions(results)
      })
    },
    defaultOptions,
    value,
    inputValue,
    onChange,
    onInputChange,
    controlShouldRenderValue: false,
    components: {
      ...components,
      DropdownIndicator: null,
      Input,
    },
  }
}

function Input(props: InputProps<InputSelectValue>): React.JSX.Element {
  const newProps = {
    ...props,
    // `.no-focus` prevents applying default styles from global.css
    inputClassName: cn(props.inputClassName, "no-focus flex-auto"),
    className: "!inline-flex after:hidden",
    isHidden: false,
  }

  return <components.Input {...newProps} />
}

GenericAsyncSelectComponent.displayName = "GenericAsyncSelectComponent"

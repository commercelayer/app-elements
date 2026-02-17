import { TZDateMini as TZDate } from "@date-fns/tz"
import { CalendarBlankIcon, XIcon } from "@phosphor-icons/react"
import cn from "classnames"
import { forwardRef, type JSX, useMemo } from "react"
import DatePicker from "react-datepicker"
import { isDateValid } from "#helpers/date"
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"

export type MaybeDate = Date | null

export interface InputDateProps extends InputWrapperBaseProps {
  /**
   * Controlled value
   */
  value?: MaybeDate
  /**
   * Callback fired when value is changed
   */
  onChange: (date: MaybeDate) => void
  /**
   * Optional CSS class names used for the outer wrapper/container element
   */
  wrapperClassName?: string
  /**
   * Optional CSS class names used for the input element
   */
  inputClassName?: string
  /**
   * Optional placeholder text
   */
  placeholder?: string
  /**
   * Show the time selector
   */
  showTimeSelect?: boolean | undefined
  /**
   * String to be parsed as formatter (eg. MM/dd/yyyy, dd-MM-yy, ect...).
   * When undefined, will autodetect format from user's browser.
   */
  format?: string
  /**
   * Timezone string to be used for date formatting.
   * (eg. `Africa/Nairobi`, `America/New_York`, `Etc/UTC`, ect...).
   * When undefined or not valid, will autodetect user's browser timezone.
   */
  timezone?: string
  /**
   * Disable selection of previous dates
   */
  minDate?: Date
  /**
   * Set placeholder as detected date format
   */
  autoPlaceholder?: boolean
  /**
   * Enables a button to clear the selected date
   */
  isClearable?: boolean
  /**
   * Prevent the date picker calendar from opening on focus,
   * this is useful when showing validation error message and
   * to avoid the calendar to open on top of the error message
   */
  preventOpenOnFocus?: boolean
  /**
   * Use fixed positioning strategy for the date picker popper.
   * This is useful when the date picker is used inside a modal.
   * @default false
   */
  fixedPopper?: boolean
}

export const InputDateComponent = forwardRef<DatePicker, InputDateProps>(
  (
    {
      onChange,
      value,
      wrapperClassName,
      inputClassName,
      showTimeSelect = false,
      format,
      timezone,
      placeholder,
      minDate,
      label,
      autoPlaceholder,
      isClearable,
      hint,
      feedback,
      preventOpenOnFocus,
      fixedPopper = false,
      ...rest
    },
    ref,
  ): JSX.Element => {
    const selectedDateInTimezone = useMemo(() => {
      if (value == null) return null
      const tzDate = new TZDate(value, timezone)
      return isDateValid(tzDate) ? tzDate : value
    }, [value, timezone])

    const dateFormat = format ?? detectDateTimeFormat(showTimeSelect)
    return (
      <InputWrapper
        {...rest}
        className={wrapperClassName}
        hint={hint}
        feedback={feedback}
        label={label}
      >
        <div className="relative w-full">
          <DatePicker
            ref={ref}
            popperProps={
              fixedPopper
                ? {
                    strategy: "fixed",
                  }
                : undefined
            }
            selected={selectedDateInTimezone}
            onChange={onChange}
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            placeholderText={
              autoPlaceholder === true ? dateFormat.toLowerCase() : placeholder
            }
            minDate={minDate}
            openToDate={selectedDateInTimezone ?? minDate}
            className={cn(
              "block w-full px-4 py-2.5 placeholder:text-gray-400 font-normal text-sm",
              "rounded outline-0",
              "transition duration-500 ease-in-out focus:outline-0 focus:border-primary-light",
              getFeedbackStyle(feedback),
              inputClassName,
            )}
            preventOpenOnFocus={preventOpenOnFocus}
          />
          <div className="absolute top-0 bottom-0 right-4 flex items-center pointer-events-none touch-none">
            <CalendarBlankIcon />
          </div>
          {selectedDateInTimezone != null && isClearable === true ? (
            <button
              type="button"
              className="absolute top-0 bottom-0 right-11 flex items-center"
              onClick={() => {
                onChange(null)
              }}
            >
              <XIcon />
            </button>
          ) : null}
        </div>
      </InputWrapper>
    )
  },
)

InputDateComponent.displayName = "InputDateComponent"

function detectDateTimeFormat(showTime: boolean): string {
  const date = new Date(2023, 11, 15) //  15th of December

  const dateFormat = date
    .toLocaleDateString()
    .replace("15", "dd")
    .replace("12", "MM")
    .replace("2023", "yyyy")

  const timeFormat = ", h:mm aa"

  return `${dateFormat}${showTime ? timeFormat : ""}`
}

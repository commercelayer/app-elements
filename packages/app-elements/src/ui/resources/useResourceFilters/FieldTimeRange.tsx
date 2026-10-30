import { type JSX, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { formatDateRange } from "#helpers/date"
import { useTranslation } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Spacer } from "#ui/atoms/Spacer"
import { Modal } from "#ui/composite/Modal"
import { HookedInputDate } from "#ui/forms/InputDate"
import { HookedInputToggleButton } from "#ui/forms/InputToggleButton"
import {
  getDefaultBrowserTimezone,
  getTimeRangePresetName,
  toEndOfDayWhenMidnight,
} from "./timeUtils"
import {
  type FilterItemTime,
  filterableTimeRangePreset,
  type TimeRangeFormValues,
} from "./types"

interface FieldTimeRangeProps {
  item: FilterItemTime
}

export function FieldTimeRange({ item }: FieldTimeRangeProps): JSX.Element {
  const { user } = useTokenProvider()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  const { watch, setValue, trigger } = useFormContext<TimeRangeFormValues>()
  const timePreset = watch("timePreset")
  const timeFrom = watch("timeFrom")
  const timeTo = watch("timeTo")

  useEffect(
    function openToTimeRangePickerOverlay() {
      const isRangeNotSet = timeFrom == null || timeTo == null
      if (timePreset === "custom" && isRangeNotSet) {
        setIsModalOpen(true)
      }
    },
    [timePreset],
  )

  useEffect(
    function resetTimeRangeOnPreset() {
      if (timePreset !== "custom") {
        setValue("timeFrom", null)
        setValue("timeTo", null)
      }
    },
    [timePreset],
  )

  useEffect(
    function validateOnChange() {
      void trigger("timeFrom")
    },
    [timeFrom],
  )

  useEffect(
    function validateOnChange() {
      void trigger("timeTo")
    },
    [timeTo],
  )

  const previousTimeTo = useRef(timeTo)
  useEffect(
    function includePickedDayInRange() {
      // only on the first pick: a time chosen afterwards is kept as it is
      const wasEmpty = previousTimeTo.current == null
      previousTimeTo.current = timeTo
      if (wasEmpty && timeTo != null) {
        const endOfPickedDay = toEndOfDayWhenMidnight(timeTo, user?.timezone)
        if (endOfPickedDay.getTime() !== timeTo.getTime()) {
          setValue("timeTo", endOfPickedDay)
        }
      }
    },
    [timeTo],
  )

  return (
    <>
      <HookedInputToggleButton
        label={item.label}
        name="timePreset"
        mode="single"
        options={filterableTimeRangePreset.map((option) => {
          const label =
            option === "custom" && timeFrom != null && timeTo != null
              ? formatDateRange({
                  rangeFrom: timeFrom.toString(),
                  rangeTo: timeTo.toString(),
                  timezone: user?.timezone ?? getDefaultBrowserTimezone(),
                  locale: user?.locale,
                })
              : getTimeRangePresetName(option, t)
          return {
            label,
            value: option,
          }
        })}
      />
      <Modal
        show={isModalOpen}
        size="x-small"
        dismissible
        onClose={() => {
          setValue("timeFrom", null)
          setValue("timeTo", null)
          setValue("timePreset", null)
          setIsModalOpen(false)
        }}
      >
        <Modal.Header>{t("common.custom_time_range")}</Modal.Header>
        <Modal.Body>
          <Spacer bottom="4">
            <HookedInputDate
              name="timeFrom"
              label={t("common.from")}
              isClearable
              preventOpenOnFocus
              showTimeSelect
              timezone={user?.timezone}
            />
          </Spacer>
          <HookedInputDate
            name="timeTo"
            label={t("common.to")}
            minDate={timeFrom ?? undefined}
            isClearable
            preventOpenOnFocus
            showTimeSelect
            timezone={user?.timezone}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            fullWidth
            type="button"
            onClick={() => {
              void trigger().then((isValid) => {
                if (isValid) {
                  setIsModalOpen(false)
                }
              })
            }}
          >
            {t("common.apply")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

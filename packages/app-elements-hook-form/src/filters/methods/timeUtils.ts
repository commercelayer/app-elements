import {
  formatDate,
  getIsoDateAtDayEdge,
  getIsoDateAtDaysBefore
} from '@commercelayer/app-elements'
import { z } from 'zod'
import type { TimeRangeFormValues, TimeRangePreset } from './types'
import { filtrableTimeRangePreset } from './types'

interface MakerSdkFilterTimeParams {
  timePreset?: TimeRangePreset
  timeFrom?: Date | null
  timeTo?: Date | null
  timezone?: string
  sdkFilterName?: string
}

export const makeSdkFilterTime = ({
  timePreset,
  timeFrom,
  timeTo,
  timezone,
  sdkFilterName
}: MakerSdkFilterTimeParams): Record<string, string | undefined> => {
  const now = new Date().toISOString()

  if (sdkFilterName == null) {
    return {}
  }

  switch (timePreset) {
    case 'today':
      return {
        [`${sdkFilterName}_gteq`]: getIsoDateAtDaysBefore({
          isoString: now,
          days: 0,
          timezone
        })
      }

    case 'last7days':
      return {
        [`${sdkFilterName}_gteq`]: getIsoDateAtDaysBefore({
          isoString: now,
          days: 7,
          timezone
        })
      }

    case 'last30days':
      return {
        [`${sdkFilterName}_gteq`]: getIsoDateAtDaysBefore({
          isoString: now,
          days: 30,
          timezone
        })
      }

    case 'custom':
      return timeFrom != null && timeTo != null
        ? {
            [`${sdkFilterName}_gteq`]: getIsoDateAtDayEdge({
              isoString: timeFrom.toISOString(),
              edge: 'startOfTheDay',
              timezone
            }),
            [`${sdkFilterName}_lteq`]: getIsoDateAtDayEdge({
              isoString: timeTo.toISOString(),
              edge: 'endOfTheDay',
              timezone
            })
          }
        : {}

    case undefined:
      return {}
  }
}

export function getTimeRangeCustomLabel(
  timeFrom: Date,
  timeTo: Date,
  timezone = getDefaultBrowserTimezone()
): string {
  const formattedFrom = formatDate({ isoDate: timeFrom.toString(), timezone })
  const formattedTo = formatDate({ isoDate: timeTo.toString(), timezone })
  const formattedFromMonthFrom = formattedFrom.split(' ')[0] ?? ''
  const formattedToMonthFrom = formattedTo.split(' ')[0] ?? ''

  const dayFrom = timeFrom.getDate()
  const dayTo = timeTo.getDate()

  if (formattedFromMonthFrom === formattedToMonthFrom) {
    return `${dayFrom}-${dayTo} ${formattedFromMonthFrom}`
  }

  return `${formattedFrom} - ${formattedTo}`
}

function getDefaultBrowserTimezone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
}

export function getTimeRangePresetName(
  timeRangePreset: TimeRangePreset
): string {
  const dictionary: Record<TimeRangePreset, string> = {
    today: 'Today',
    last7days: 'Last 7 days',
    last30days: 'Last 30 days',
    custom: 'Custom'
  }

  return dictionary[timeRangePreset]
}

export const timeRangeValidationSchema = z
  .object({
    timeFrom: z.date().optional().nullable(),
    timeTo: z.date().optional().nullable(),
    timePreset: z.enum(filtrableTimeRangePreset).optional().nullable()
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (data.timePreset === 'custom' && data.timeFrom == null) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeFrom'],
        message: 'Please enter a valid "From" date'
      })
    }
    if (data.timePreset === 'custom' && data.timeTo == null) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeTo'],
        message: 'Please enter a valid "To" date'
      })
    }
    if (
      data.timePreset === 'custom' &&
      data.timeFrom != null &&
      data.timeTo != null &&
      data.timeFrom > data.timeTo
    ) {
      ctx.addIssue({
        code: 'invalid_date',
        path: ['timeTo'],
        message: 'The "To" date must be greater than the "From" date'
      })
    }
  })

export const timeRangeFilterUiNames: Array<keyof TimeRangeFormValues> = [
  'timePreset',
  'timeFrom',
  'timeTo'
]

export function isTimeRangeFilterUiName(
  filterUiName: string
): filterUiName is keyof TimeRangeFormValues {
  return timeRangeFilterUiNames.includes(
    filterUiName as keyof TimeRangeFormValues
  )
}

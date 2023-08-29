import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/hook-form/HookedForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldCurrencyRange } from './FieldCurrencyRange'
import { FieldItem } from './FieldItem'
import { FieldTimeRange } from './FieldTimeRange'
import { makeFilterAdapters } from './adapters'
import { timeRangeValidationSchema } from './timeUtils'
import type { FiltersInstructions } from './types'
import { isItemOptions } from './types'

export interface FiltersFormProps {
  /**
   * Array of instruction items to build the filters behaviors
   */
  instructions: FiltersInstructions
  /**
   * New queryString generated on submit to be used to navigate to the listing page
   */
  onSubmit: (queryString: string) => void
}

function FiltersForm({
  instructions,
  onSubmit
}: FiltersFormProps): JSX.Element {
  const { adaptUrlQueryToFormValues, adaptFormValuesToUrlQuery } =
    makeFilterAdapters({
      instructions
    })

  const hasTimeRangeFilter = instructions.some(
    (item) => item.type === 'timeRange'
  )

  const methods = useForm({
    defaultValues: adaptUrlQueryToFormValues({ queryString: location.search }),
    resolver: hasTimeRangeFilter
      ? zodResolver(timeRangeValidationSchema)
      : undefined
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(formValues) => {
        onSubmit(
          adaptFormValuesToUrlQuery({
            formValues
          })
        )
      }}
    >
      {instructions.map((item) => {
        if (isItemOptions(item) && item.hidden !== true) {
          return (
            <Spacer bottom='10' key={item.label}>
              <FieldItem item={item} />
            </Spacer>
          )
        }

        if (item.type === 'timeRange') {
          return (
            <Spacer bottom='10' key={item.label}>
              <FieldTimeRange item={item} />
            </Spacer>
          )
        }

        if (item.type === 'currencyRange') {
          return (
            <Spacer bottom='10' key={item.label}>
              <FieldCurrencyRange item={item} />
            </Spacer>
          )
        }

        return null
      })}
      <div className='w-full sticky bottom-0 bg-white pb-8'>
        <Button type='submit' fullWidth>
          Apply filters
        </Button>
      </div>
    </HookedForm>
  )
}

FiltersForm.displayName = 'FiltersForm'
export { FiltersForm }

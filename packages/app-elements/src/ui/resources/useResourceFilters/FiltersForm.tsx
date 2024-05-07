import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldCurrencyRange } from './FieldCurrencyRange'
import { FieldOptions } from './FieldOptions'
import { FieldTextSearch } from './FieldTextSearch'
import { FieldTimeRange } from './FieldTimeRange'
import { makeFilterAdapters } from './adapters'
import { timeRangeValidationSchema } from './timeUtils'
import type { FiltersInstructions } from './types'

export interface FiltersFormProps {
  /**
   * Array of instruction items to build the filters behaviors
   */
  instructions: FiltersInstructions
  /**
   * New queryString generated on submit to be used to navigate to the listing page
   */
  onSubmit: (queryString: string) => void
  /**
   * By default, we strip out all filters that are not part of the `instructions` array.
   * The option `predicateWhitelist` is used to whitelist a set of predicates that you want to use as filters.
   *
   * @example
   * ```jsx
   * useResourceFilters({
   *   instructions,
   *   predicateWhitelist: [ 'starts_at_lteq', 'expires_at_gteq', 'starts_at_gt', 'expires_at_lt' ]
   * })
   * ```
   */
  predicateWhitelist: string[]
}

function FiltersForm({
  instructions,
  predicateWhitelist,
  onSubmit
}: FiltersFormProps): JSX.Element {
  const { adaptUrlQueryToFormValues, adaptFormValuesToUrlQuery } =
    makeFilterAdapters({
      instructions,
      predicateWhitelist
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
        if (item.hidden === true) {
          return null
        }

        if (item.type === 'textSearch') {
          return (
            <Spacer bottom='10' key={item.label}>
              <FieldTextSearch item={item} />
            </Spacer>
          )
        }

        if (item.type === 'options') {
          return (
            <Spacer bottom='10' key={item.label}>
              <FieldOptions item={item} />
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
      <div className='w-full sticky bottom-0 bg-gray-50 pb-8'>
        <Button type='submit' fullWidth>
          Apply filters
        </Button>
      </div>
    </HookedForm>
  )
}

FiltersForm.displayName = 'FiltersForm'
export { FiltersForm }

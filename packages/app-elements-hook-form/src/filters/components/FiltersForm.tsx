import { Form } from '#components/Form'
import { makeFilterAdapters } from '#filters/methods/adapters'
import { timeRangeValidationSchema } from '#filters/methods/timeUtils'
import type { FiltersInstructions } from '#filters/methods/types'
import { isItemOptions } from '#filters/methods/types'
import { Button, Container, Spacer } from '@commercelayer/app-elements'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldCurrencyRange } from './FieldCurrencyRange'
import { FieldItem } from './FieldItem'
import { FieldTimeRange } from './FieldTimeRange'

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
    <Form
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
            <Spacer bottom='14' key={item.label}>
              <FieldItem item={item} />
            </Spacer>
          )
        }

        if (item.type === 'timeRange') {
          return (
            <Spacer bottom='14' key={item.label}>
              <FieldTimeRange item={item} />
            </Spacer>
          )
        }

        if (item.type === 'currencyRange') {
          return (
            <Spacer bottom='14' key={item.label}>
              <FieldCurrencyRange item={item} />
            </Spacer>
          )
        }

        return null
      })}
      <Container
        minHeight={false}
        className='w-full sticky bottom-0 bg-white pb-4'
      >
        <Button type='submit' fullWidth>
          Apply filters
        </Button>
      </Container>
    </Form>
  )
}

FiltersForm.displayName = 'FiltersForm'
export { FiltersForm }

import { InputDateProps } from './InputDateComponent'
import { forwardRef, lazy, Suspense } from 'react'
import { SkeletonItem } from '#ui/atoms/Skeleton'
import DatePicker from 'react-datepicker'

const InputDateComponent = lazy(
  async () =>
    await import('./InputDateComponent').then((module) => ({
      default: module.InputDate
    }))
)

export function InputDate(
  props: InputDateProps,
  ref: React.ForwardedRef<DatePicker>
): JSX.Element {
  return (
    <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
      <InputDateComponent {...props} ref={ref} />
    </Suspense>
  )
}

export default forwardRef<DatePicker, InputDateProps>(InputDate)

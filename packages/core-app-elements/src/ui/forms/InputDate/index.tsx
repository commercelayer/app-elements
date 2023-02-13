import { InputDateProps } from './InputDateComponent'
import { forwardRef, lazy, Suspense } from 'react'
import { SkeletonItem } from '#ui/atoms/Skeleton'
import DatePicker from 'react-datepicker'

const LazyInputDate = lazy(
  async () =>
    await import('./InputDateComponent').then((module) => ({
      default: module.InputDateComponent
    }))
)

const InputDate = forwardRef<DatePicker, InputDateProps>(
  (props, ref): JSX.Element => {
    return (
      <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
        <LazyInputDate {...props} ref={ref} />
      </Suspense>
    )
  }
)

InputDate.displayName = 'InputDate'
export { InputDate }

import { SkeletonItem } from '#ui/atoms/Skeleton'
import { forwardRef, lazy, Suspense } from 'react'
import type DatePicker from 'react-datepicker'
import { type InputDateProps } from './InputDateComponent'

const LazyInputDate = lazy(
  async () =>
    await import('./InputDateComponent').then((module) => ({
      default: module.InputDateComponent
    }))
)

export const InputDate = forwardRef<DatePicker, InputDateProps>(
  (props, ref): JSX.Element => {
    return (
      <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
        <LazyInputDate {...props} ref={ref} />
      </Suspense>
    )
  }
)

InputDate.displayName = 'InputDate'

import { InputDateProps } from './InputDateComponent'
import { lazy, Suspense } from 'react'
import { SkeletonItem } from '#ui/atoms/Skeleton'

const InputDateComponent = lazy(
  async () => await import('./InputDateComponent')
)

export function InputDate(props: InputDateProps): JSX.Element {
  return (
    <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
      <InputDateComponent {...props} />
    </Suspense>
  )
}

export default InputDate

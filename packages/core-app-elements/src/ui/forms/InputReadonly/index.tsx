import { InputReadonlyProps } from './InputReadonlyComponent'
import { lazy, Suspense } from 'react'
import { SkeletonItem } from '#ui/atoms/Skeleton'

const InputReadonlyComponent = lazy(
  async () => await import('./InputReadonlyComponent')
)

export function InputReadonly(props: InputReadonlyProps): JSX.Element {
  return (
    <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
      <InputReadonlyComponent {...props} />
    </Suspense>
  )
}

export default InputReadonly

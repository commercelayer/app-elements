import { SkeletonItem } from '#ui/atoms/Skeleton'
import { forwardRef, lazy, Suspense } from 'react'
import type { CodeEditorProps } from './CodeEditorComponent'

const LazyCodeEditor = lazy(
  async () =>
    await import('./CodeEditorComponent').then((module) => ({
      default: module.CodeEditor
    }))
)

export const CodeEditor = forwardRef<HTMLInputElement, CodeEditorProps>(
  (props, ref): JSX.Element => {
    return (
      <Suspense fallback={<SkeletonItem className='h-11 w-full' />}>
        <LazyCodeEditor {...props} ref={ref} />
      </Suspense>
    )
  }
)

CodeEditor.displayName = 'CodeEditor'

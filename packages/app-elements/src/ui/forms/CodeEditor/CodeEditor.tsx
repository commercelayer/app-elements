import type { editor } from "monaco-editor"
import { forwardRef, type JSX, lazy, Suspense } from "react"
import { SkeletonItem } from "#ui/atoms/Skeleton"
import type { CodeEditorProps } from "./CodeEditorComponent"

const LazyCodeEditor = lazy(
  async () =>
    await import("./CodeEditorComponent").then((module) => ({
      default: module.CodeEditor,
    })),
)

export const CodeEditor = forwardRef<
  editor.IStandaloneCodeEditor,
  CodeEditorProps
>((props, ref): JSX.Element => {
  return (
    <Suspense fallback={<SkeletonItem className="h-11 w-full" />}>
      <LazyCodeEditor {...props} ref={ref} />
    </Suspense>
  )
})

CodeEditor.displayName = "CodeEditor"

import { forwardRef } from "react"
import type { GroupBase, SelectInstance } from "react-select"
import AsyncSelect from "react-select/async"
import {
  GenericAsyncSelectComponent,
  type GenericAsyncSelectComponentProps,
} from "./GenericAsyncComponent"
import type { InputSelectValue } from "./InputSelect"

export const AsyncSelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  GenericAsyncSelectComponentProps
>((props, ref) => {
  return (
    <GenericAsyncSelectComponent
      {...props}
      ref={ref}
      SelectComponent={AsyncSelect}
    />
  )
})

AsyncSelectComponent.displayName = "AsyncSelectComponent"

import { forwardRef } from 'react'
import { type GroupBase, type SelectInstance } from 'react-select'
import AsyncCreatableSelect from 'react-select/async-creatable'
import {
  GenericAsyncSelectComponent,
  type GenericAsyncSelectComponentProps
} from './GenericAsyncComponent'
import { type InputSelectValue } from './InputSelect'

export const AsyncCreatableSelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  GenericAsyncSelectComponentProps
>((props, ref) => {
  return (
    <GenericAsyncSelectComponent
      {...props}
      ref={ref}
      SelectComponent={AsyncCreatableSelect}
    />
  )
})

AsyncCreatableSelectComponent.displayName = 'AsyncCreatableSelectComponent'

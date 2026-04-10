import type { JSX } from "react"
import { HookedInput } from "#ui/forms/Input"
import type { FilterItemTextSearch } from "./types"
import { getFieldKey } from "./types"

interface FieldProps {
  item: FilterItemTextSearch
}

export function FieldTextSearch({ item }: FieldProps): JSX.Element | null {
  switch (item.render.component) {
    case "searchBar":
      return null

    case "input":
      return <HookedInput label={item.label} name={getFieldKey(item.sdk)} />
  }
}

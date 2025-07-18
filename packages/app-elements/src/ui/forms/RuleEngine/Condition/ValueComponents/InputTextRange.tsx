import type React from "react"
import { useState } from "react"
import { Input } from "#ui/forms/Input"
import type { ItemWithValue } from "../../utils"

export function InputTextRange({
  value,
  onChange,
}: {
  value: ItemWithValue["value"]
  onChange: (value: [string | null, string | null]) => void
}): React.JSX.Element {
  const [min, setMin] = useState<string | null>(
    Array.isArray(value) && typeof value[0] === "string" ? value[0] : null,
  )
  const [max, setMax] = useState<string | null>(
    Array.isArray(value) && typeof value[1] === "string" ? value[1] : null,
  )

  return (
    <div className="flex items-center gap-4">
      <div className="grow">
        <Input
          type="text"
          placeholder="Min"
          value={min ?? ""}
          onChange={(event) => {
            const newValue = event.currentTarget.value
            setMin(newValue)
            onChange([newValue, max])
          }}
        />
      </div>
      <span className="text-gray-300">to</span>
      <div className="grow">
        <Input
          type="text"
          placeholder="Max"
          value={max ?? ""}
          onChange={(event) => {
            const newValue = event.currentTarget.value
            setMax(newValue)
            onChange([min, newValue])
          }}
        />
      </div>
    </div>
  )
}

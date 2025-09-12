import type React from "react"
import { useEffect, useState } from "react"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useRuleEngine } from "../../RuleEngineContext"
import type { ItemWithValue } from "../../utils"

type ArrayMatcherDictionary = Record<
  keyof Extract<ItemWithValue["value"], Record<string, unknown>>,
  {
    label: string
  }
>

const arrayMatcherDictionary: ArrayMatcherDictionary = {
  in_and: {
    label: "all of",
  },
  in_or: {
    label: "at least one of",
  },
  not_in_and: {
    label: "not any of",
  },
  not_in_or: {
    label: "not at least one of",
  },
}

export function InputArrayMatch({
  value,
  pathPrefix,
}: {
  value?: ItemWithValue["value"]
  pathPrefix: string
}): React.JSX.Element {
  if (typeof value !== "object" || Array.isArray(value) || value === null) {
    value = {
      in_and: [],
    }
  }

  return (
    <div>
      {Object.entries(value).map(([operation, operationValue], index) => {
        return (
          <InputArrayMatchItem
            pathPrefix={pathPrefix}
            defaultValue={operationValue}
            initialMatcher={operation as keyof ArrayMatcherDictionary}
            key={`${pathPrefix}.${
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
              index
            }`}
          />
        )
      })}
    </div>
  )
}

function InputArrayMatchItem({
  initialMatcher,
  defaultValue,
  pathPrefix,
}: {
  initialMatcher: keyof ArrayMatcherDictionary
  defaultValue: Extract<ItemWithValue["value"], any[]>
  pathPrefix: string
}): React.JSX.Element {
  const [prevMatcher, setPrevMatcher] =
    useState<keyof ArrayMatcherDictionary>(initialMatcher)
  const [matcher, setMatcher] =
    useState<keyof ArrayMatcherDictionary>(initialMatcher)
  const [value, setValue] =
    useState<Extract<ItemWithValue["value"], any[]>>(defaultValue)
  const { setPath } = useRuleEngine()

  useEffect(() => {
    if (prevMatcher !== matcher) {
      setPath(`${pathPrefix}.${prevMatcher}`, null)
      setPrevMatcher(matcher)
    }

    setPath(`${pathPrefix}.${matcher}`, value)
  }, [matcher, value, setPath])

  return (
    <div className="flex gap-2 last-of-type:mt-2">
      <div className="shrink-0">
        <InputSelect
          defaultValue={[
            { value: matcher, label: arrayMatcherDictionary[matcher].label },
          ]}
          initialValues={Object.entries(arrayMatcherDictionary).map(
            ([value, { label }]) => ({
              value,
              label,
            }),
          )}
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setMatcher(selected.value as keyof ArrayMatcherDictionary)
            }
          }}
        />
      </div>
      <div className="grow">
        <InputSelect
          isMulti
          isCreatable
          defaultValue={(Array.isArray(value) ? value : []).map((v) => ({
            value: v,
            label: v.toString(),
          }))}
          initialValues={[]}
          onSelect={(selected) => {
            if (isMultiValueSelected(selected)) {
              setValue(
                selected.map((s) =>
                  typeof s.value === "boolean" ? s.value.toString() : s.value,
                ),
              )
            }
          }}
        />
      </div>
    </div>
  )
}

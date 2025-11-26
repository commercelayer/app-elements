import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Hr } from "#ui/atoms/Hr"
import { Icon } from "#ui/atoms/Icon"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputSelect, isMultiValueSelected } from "#ui/forms/InputSelect"
import { OptionRow } from "../../layout/OptionRow"
import { useRuleEngine } from "../../RuleEngineContext"
import type { ItemWithValue } from "../../utils"
import type { useResourcePathInfos } from "../hooks"
import { InputResourceSelector } from "./InputResourceSelector"

type ArrayMatcherDictionary = Record<
  keyof Extract<ItemWithValue["value"], Record<string, unknown>>,
  {
    label: string
  }
>

const arrayMatcherDictionary: ArrayMatcherDictionary = {
  in_and: {
    label: "All of",
  },
  in_or: {
    label: "At least one of",
  },
  not_in_and: {
    label: "Not any of",
  },
  not_in_or: {
    label: "Not at least one of",
  },
}

export function InputArrayMatch({
  value,
  pathPrefix,
  hasResourceSelector = false,
  infos,
}: {
  value?: ItemWithValue["value"]
  pathPrefix: string
  hasResourceSelector?: boolean
  infos: ReturnType<typeof useResourcePathInfos>["infos"]
}): React.JSX.Element {
  const { setPath } = useRuleEngine()

  const firstKey = Object.keys(
    arrayMatcherDictionary,
  )[0] as keyof ArrayMatcherDictionary

  const validValue = useMemo(() => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return value as Extract<ItemWithValue["value"], Record<string, unknown>>
    }

    return {
      [firstKey]: [],
    }
  }, [value])

  useEffect(() => {
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      setPath(pathPrefix, {
        [firstKey]: [],
      })
    }
  }, [value])

  const remainingKeys = Object.keys(arrayMatcherDictionary).filter(
    (key) => !(key in validValue),
  ) as (keyof ArrayMatcherDictionary)[]

  return (
    <div className="flex flex-col" key={remainingKeys.join("-")}>
      {Object.entries(validValue).map(([operation, operationValue], index) => {
        return (
          <InputArrayMatchItem
            infos={infos}
            hasResourceSelector={hasResourceSelector}
            pathPrefix={pathPrefix}
            defaultValue={operationValue}
            initialMatcher={operation as keyof ArrayMatcherDictionary}
            remainingKeys={remainingKeys}
            key={`${pathPrefix}.${
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
              index
            }`}
          />
        )
      })}
      {remainingKeys.length > 0 && (
        <Spacer top="4">
          <Dropdown
            className="inline-flex"
            menuPosition="bottom-left"
            dropdownItems={[
              remainingKeys.map((key) => (
                <DropdownItem
                  onClick={() => {
                    setPath(`${pathPrefix}.${key}`, [])
                  }}
                  label={arrayMatcherDictionary[key].label}
                  key={key}
                />
              )),
            ]}
            dropdownLabel={
              <button type="button">
                <Text className="flex gap-2 items-center">
                  <Text weight="bold" size="small">
                    Add value
                  </Text>{" "}
                  <Icon name="caretDown" />
                </Text>
              </button>
            }
          />
          <Spacer top="6" bottom="2">
            <Hr variant="dashed" />
          </Spacer>
        </Spacer>
      )}
    </div>
  )
}

function InputArrayMatchItem({
  initialMatcher,
  defaultValue,
  pathPrefix,
  hasResourceSelector,
  infos,
  remainingKeys,
}: {
  initialMatcher: keyof ArrayMatcherDictionary
  defaultValue: Extract<ItemWithValue["value"], any[]>
  pathPrefix: string
  hasResourceSelector: boolean
  infos: ReturnType<typeof useResourcePathInfos>["infos"]
  remainingKeys: (keyof ArrayMatcherDictionary)[]
}): React.JSX.Element {
  const [value, setValue] =
    useState<Extract<ItemWithValue["value"], any[]>>(defaultValue)
  const { setPath } = useRuleEngine()

  useEffect(() => {
    setPath(`${pathPrefix}.${initialMatcher}`, value)
  }, [value])

  return (
    <OptionRow
      label={
        <Dropdown
          className="inline-flex"
          menuPosition="bottom-left"
          dropdownItems={[
            remainingKeys.map((key) => (
              <DropdownItem
                onClick={() => {
                  setPath(`${pathPrefix}.${key}`, value)
                  setPath(`${pathPrefix}.${initialMatcher}`, null)
                }}
                label={arrayMatcherDictionary[key].label}
                key={key}
              />
            )),
            <DropdownDivider
              key="divider"
              hidden={remainingKeys.length === 0}
            />,
            <DropdownItem
              key="remove"
              disabled={
                remainingKeys.length ===
                Object.keys(arrayMatcherDictionary).length - 1
              }
              onClick={() => {
                setPath(`${pathPrefix}.${initialMatcher}`, null)
              }}
              label="Remove"
            />,
          ]}
          dropdownLabel={
            <button type="button">
              <Text
                variant="info"
                size="small"
                className="flex gap-2 items-center"
              >
                {arrayMatcherDictionary[initialMatcher].label}{" "}
                <Icon name="caretDown" />
              </Text>
            </button>
          }
        />
      }
    >
      {hasResourceSelector ? (
        <InputResourceSelector
          infos={infos}
          value={value}
          pathKey={`${pathPrefix}.${initialMatcher}`}
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
      ) : (
        <InputSelect
          isMulti
          isCreatable
          placeholder="Enter value"
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
      )}
    </OptionRow>
  )
}

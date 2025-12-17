import { useEffect } from "react"
import { useTranslation } from "#providers/I18NProvider"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useAvailableGroups } from "../Condition/hooks"
import { ListItemContainer } from "../layout/ListItemContainer"
import { OptionRow } from "../layout/OptionRow"
import { Options } from "../Options"
import { useAvailableOptions } from "../optionsConfig"
import type { RuleEngineProps } from "../RuleEngineComponent"
import { useRuleEngine } from "../RuleEngineContext"
import type { ActionType, SchemaActionItem } from "../utils"
import { ActionValue } from "./ActionValue"

export function ActionListItem({
  item,
  index,
  onDelete,
}: {
  item: SchemaActionItem | null
  index: number
  onDelete?: () => void
}): React.ReactNode {
  const {
    setPath,
    setRenderOption,
    state: { selectedRuleIndex },
    optionsConfig,
  } = useRuleEngine()

  const availableActionTypes = Object.keys(
    optionsConfig.actions,
  ) as ActionType[]

  const actionOptionsConfig =
    item?.type != null && item?.selector != null
      ? (optionsConfig.actions?.[item.type]?.[
          item.selector as keyof (typeof optionsConfig.actions)[typeof item.type]
        ] ?? [])
      : []

  const { available: availableOptions } = useAvailableOptions(
    item,
    actionOptionsConfig,
  )

  type Item = NonNullable<typeof item>
  const typeDictionary: Record<Item["type"], string> = {
    percentage: "Percentage discount",
    fixed_amount: "Fixed amount",
    fixed_price: "Fixed price",
    buy_x_pay_y: "Buy X, Pay Y",
    every_x_discount_y: "Every X, Discount Y",
  }

  const pathPrefix = `rules.${selectedRuleIndex}.actions.${index}`

  return (
    <div className="mb-4 last:mb-0">
      <ListItemContainer
        pathPrefix={pathPrefix}
        dropdownItems={
          onDelete != null ? (
            <DropdownItem
              label="Delete"
              onClick={() => {
                setPath(`${pathPrefix}`, null)
                setRenderOption(`${pathPrefix}`, null)
                onDelete()
              }}
            />
          ) : undefined
        }
        options={
          <>
            <ActionSelector item={item} pathPrefix={pathPrefix} />
            <ActionGroups item={item} pathPrefix={pathPrefix} />
            <Options item={item} pathPrefix={pathPrefix} />

            {availableOptions.length > 0 && (
              <Dropdown
                className="inline-flex mt-6"
                menuPosition="bottom-left"
                dropdownItems={availableOptions.map((option) => (
                  <DropdownItem
                    onClick={() => {
                      // Set default values based on option type
                      switch (option.name) {
                        case "round":
                          setPath(`${pathPrefix}.round`, true)
                          break
                        case "apply_on":
                          setPath(`${pathPrefix}.apply_on`, null, true)
                          break
                        case "discount_mode":
                          setPath(`${pathPrefix}.discount_mode`, "default")
                          break
                        case "limit":
                          setPath(`${pathPrefix}.limit`, {})
                          break
                        case "aggregation":
                          setPath(`${pathPrefix}.aggregation`, {})
                          break
                        case "bundle":
                          setPath(`${pathPrefix}.bundle`, {
                            type: "balanced",
                          })
                          break
                      }
                    }}
                    label={option.label}
                    key={`option-${option.name}`}
                  />
                ))}
                dropdownLabel={
                  <button type="button">
                    <Text className="flex gap-2 items-center">
                      <Text weight="bold" size="small">
                        Add option
                      </Text>{" "}
                      <Icon name="caretDown" />
                    </Text>
                  </button>
                }
              />
            )}
          </>
        }
      >
        {/* Action type */}
        <div className="flex-1">
          <InputSelect
            name={`${pathPrefix}.type`}
            defaultValue={
              item != null && item.type != null
                ? {
                    label: typeDictionary[item.type],
                    value: item.type,
                  }
                : undefined
            }
            initialValues={availableActionTypes.map((type) => ({
              value: type,
              label: typeDictionary[type],
            }))}
            onSelect={(selected) => {
              if (isSingleValueSelected(selected)) {
                setPath(`${pathPrefix}.type`, selected.value)
              }
            }}
          />
        </div>

        {/* Action value */}
        <ActionValue item={item} pathPrefix={pathPrefix} />
      </ListItemContainer>
    </div>
  )
}

function ActionSelector({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | null
  pathPrefix: string
}) {
  const { setPath, schemaType } = useRuleEngine()
  const { t } = useTranslation()

  const initialValues = actionPaths[schemaType].map((field) => ({
    value: field,
    label: (t(`resource_paths.${field}`) as string).replace(
      "resource_paths.",
      "",
    ),
  }))

  const name = `${pathPrefix}.selector`

  return (
    <OptionRow
      label={
        <Text variant="info" size="small">
          Apply to
        </Text>
      }
    >
      <InputSelect
        name={name}
        isSearchable={false}
        initialValues={initialValues}
        value={
          item?.selector == null
            ? undefined
            : (initialValues.find((c) => c.value === item.selector) ?? {
                value: item.selector,
                label: item.selector,
              })
        }
        onSelect={async (selection) => {
          if (isSingleValueSelected(selection)) {
            setPath(name, selection.value)
            setPath(`${pathPrefix}.apply_on`, null)
          }
        }}
      />
    </OptionRow>
  )
}

function ActionGroups({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | null
  pathPrefix: string
}) {
  const { setPath, schemaType } = useRuleEngine()
  const availableGroups = useAvailableGroups()

  useEffect(() => {
    if (availableGroups.length === 0 && (item?.groups ?? []).length > 0) {
      setPath(`${pathPrefix}.groups`, [])
    }
  }, [availableGroups])

  if (availableGroups.length <= 0 && (item?.groups ?? []).length <= 0) {
    return null
  }

  return (
    <OptionRow
      label={
        <Text variant="info" size="small">
          Groups
        </Text>
      }
    >
      <InputSelect
        name={`${pathPrefix}.groups`}
        isMulti
        isClearable={false}
        value={
          item != null
            ? item.groups?.map((groups) => ({
                label: availableGroups.includes(groups)
                  ? groups
                  : `⚠️   ${groups}`,
                value: groups,
              }))
            : undefined
        }
        initialValues={availableGroups.map((group) => ({
          value: group,
          label: group,
        }))}
        onSelect={(selected) => {
          if (isMultiValueSelected(selected)) {
            setPath(
              `${pathPrefix}.groups`,
              selected.map((s) => s.value),
            )

            if (schemaType === "order-rules" && selected.length > 0) {
              setPath(`${pathPrefix}.selector`, "order.line_items")
            }
          }
        }}
      />
    </OptionRow>
  )
}

const actionPaths = {
  "order-rules": [
    "order",
    "order.line_items",
    "order.line_items.line_item_options",
    "order.line_items.sku",
    "order.line_items.bundle",
    "order.line_items.shipment",
    "order.line_items.payment_method",
    "order.line_items.adjustment",
    "order.line_items.gift_card",
  ] as const,
  "price-rules": ["price"] as const,
} satisfies Record<RuleEngineProps["schemaType"], string[]>

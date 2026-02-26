import { useEffect } from "react"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { ListItemContainer } from "../layout/ListItemContainer"
import { ActionOptions } from "../Options"
import { useAvailableOptions } from "../optionsConfig"
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
    schemaType,
  } = useRuleEngine()

  const availableActionTypes = Object.keys(
    optionsConfig.actions,
  ) as ActionType[]

  const selector = item != null && "selector" in item ? item.selector : ""

  const actionOptionsConfig =
    item?.type != null
      ? (optionsConfig.actions?.[item.type]?.[
          selector as keyof (typeof optionsConfig.actions)[typeof item.type]
        ] ?? [])
      : []

  const { available: availableOptions, required: requiredOptions } =
    useAvailableOptions(item, actionOptionsConfig)

  type Item = NonNullable<typeof item>
  const typeDictionary: Record<Item["type"], string> = {
    free_gift: "Free gift",
    percentage: "Percentage discount",
    fixed_amount: "Fixed amount",
    fixed_price: "Fixed price",
    buy_x_pay_y: "Buy X, Pay Y",
    every_x_discount_y: "Every X, Discount Y",
  }

  const pathPrefix = `rules.${selectedRuleIndex}.actions.${index}`

  const setDefaultOptionFor = (optionName: string) => {
    switch (optionName) {
      case "selector":
        setPath(
          `${pathPrefix}.selector`,
          schemaType === "order-rules"
            ? "order.line_items"
            : schemaType === "price-rules"
              ? "price"
              : null,
          true,
        )
        break
      case "groups":
        setPath(`${pathPrefix}.groups`, [])
        break
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
      case "quantity":
        setPath(`${pathPrefix}.quantity`, null, true)
        break
      case "identifiers": {
        setPath(`${pathPrefix}.identifiers`, {})
        break
      }
    }
  }

  useEffect(
    function ensureRequiredOptions() {
      if (item == null) {
        return
      }

      requiredOptions.forEach((option) => {
        if (!(option.name in item)) {
          setDefaultOptionFor(option.name)
        }
      })
    },
    [item, requiredOptions, pathPrefix],
  )

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
            <ActionOptions item={item} pathPrefix={pathPrefix} />

            {availableOptions.length > 0 && (
              <Dropdown
                className="inline-flex mt-6"
                menuPosition="bottom-left"
                dropdownItems={availableOptions.map((option) => (
                  <DropdownItem
                    onClick={() => {
                      // Set default values based on option type
                      setDefaultOptionFor(option.name)
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
                setPath(`${pathPrefix}`, {
                  type: selected.value,
                })
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

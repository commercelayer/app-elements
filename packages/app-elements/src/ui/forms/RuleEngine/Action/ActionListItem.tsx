import { useEffect } from "react"
import { useTranslation } from "#providers/I18NProvider"
import { Icon } from "#ui/atoms/Icon"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useAvailableGroups } from "../Condition/hooks"
import type { RuleEngineProps } from "../RuleEngineComponent"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaActionItem } from "../utils"
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
    schemaType,
    state: { selectedRuleIndex },
    availableActionTypes,
  } = useRuleEngine()

  const availableGroups = useAvailableGroups()

  type Item = NonNullable<typeof item>
  const typeDictionary: Record<Item["type"], string> = {
    percentage: "Percentage discount",
    fixed_amount: "Fixed amount",
    fixed_price: "Fixed price",
    buy_x_pay_y: "Buy X, Pay Y",
    every_x_discount_y: "Every X, Discount Y",
  }

  const pathPrefix = `rules.${selectedRuleIndex}.actions.${index}`

  useEffect(() => {
    if (availableGroups.length === 0 && (item?.groups ?? []).length > 0) {
      setPath(`${pathPrefix}.groups`, [])
    }
  }, [availableGroups])

  return (
    <div className="mb-4 last:mb-0">
      <div className="bg-gray-50 rounded-md flex items-center">
        <div className="flex flex-col grow">
          <div className="flex items-center justify-between gap-2 p-2">
            {/* Action type */}
            <div className="flex-1">
              <InputSelect
                name={`${pathPrefix}.type`}
                defaultValue={
                  item != null
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

            {/* ON */}
            <div className="text-black font-bold text-sm">ON</div>

            {/* Action target */}
            <div className="flex-1">
              <InputActionSelector
                value={item?.selector}
                name={`${pathPrefix}.selector`}
              />
            </div>
          </div>
          {/* Groups */}
          {(availableGroups.length > 0 || (item?.groups ?? []).length > 0) && (
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="text-black font-bold text-sm px-2">GROUPS</div>
              <div className="flex-1">
                <InputSelect
                  name={`${pathPrefix}.groups`}
                  isMulti
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
              </div>
            </div>
          )}
        </div>
        {onDelete != null && (
          <Dropdown
            className="w-8 border-l border-gray-100 flex items-center justify-center self-stretch"
            dropdownLabel={
              <button
                type="button"
                className="flex items-center justify-center self-stretch grow"
              >
                <Icon name="dotsThreeVertical" size={16} weight="bold" />
              </button>
            }
            dropdownItems={
              <DropdownItem
                label="Delete"
                onClick={() => {
                  setPath(`${pathPrefix}`, null)
                  onDelete()
                }}
              />
            }
          />
        )}
      </div>
    </div>
  )
}

export function InputActionSelector({
  value,
  name,
}: {
  value: string | undefined
  name: string
}): React.JSX.Element {
  const { setPath, schemaType } = useRuleEngine()
  const { t } = useTranslation()

  const initialValues = actionPaths[schemaType].map((field) => ({
    value: field,
    label: (t(`resource_paths.${field}`) as string).replace(
      "resource_paths.",
      "",
    ),
  }))

  return (
    <InputSelect
      name={name}
      isSearchable={false}
      initialValues={initialValues}
      value={initialValues.find((c) => c.value === value)}
      onSelect={async (selection) => {
        if (isSingleValueSelected(selection)) {
          setPath(name, selection.value)
        }
      }}
    />
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

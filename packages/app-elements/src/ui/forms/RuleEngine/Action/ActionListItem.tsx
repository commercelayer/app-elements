import { useEffect } from "react"
import { Text } from "src/main"
import { useTranslation } from "#providers/I18NProvider"
import { DropdownItem } from "#ui/composite/Dropdown"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useAvailableGroups } from "../Condition/hooks"
import { ListItemContainer } from "../layout/ListItemContainer"
import { OptionRow } from "../layout/OptionRow"
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
      <ListItemContainer
        dropdownItems={
          onDelete != null ? (
            <DropdownItem
              label="Delete"
              onClick={() => {
                setPath(`${pathPrefix}`, null)
                onDelete()
              }}
            />
          ) : undefined
        }
        options={
          <>
            <OptionRow label={<Text variant="info">Apply to</Text>}>
              <InputActionSelector
                value={item?.selector}
                name={`${pathPrefix}.selector`}
              />
            </OptionRow>

            {(availableGroups.length > 0 ||
              (item?.groups ?? []).length > 0) && (
              <OptionRow label={<Text variant="info">Groups</Text>}>
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
              </OptionRow>
            )}
          </>
        }
      >
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
      </ListItemContainer>
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

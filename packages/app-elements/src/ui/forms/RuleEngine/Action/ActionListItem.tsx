import { Icon } from "#ui/atoms/Icon"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { Input } from "#ui/forms/Input"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
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
    state: { selectedRuleIndex },
  } = useRuleEngine()

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
      <div className="bg-gray-50 rounded-md flex items-center">
        <div className="flex items-center justify-between gap-2 grow p-2">
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
              initialValues={Object.entries(typeDictionary).map(
                ([value, label]) => ({ value, label }),
              )}
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
            <Input
              name={`${pathPrefix}.selector`}
              type="text"
              defaultValue={item != null ? item.selector : undefined}
              onChange={(event) => {
                setPath(`${pathPrefix}.selector`, event.currentTarget.value)
              }}
            />
          </div>
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

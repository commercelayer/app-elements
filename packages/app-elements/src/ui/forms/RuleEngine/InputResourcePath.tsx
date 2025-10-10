import { uniqBy } from "lodash-es"
import { useRef } from "react"
import type { GroupBase, SelectInstance } from "react-select"
import { useTranslation } from "#providers/I18NProvider"
import { fetchCoreResourcesSuggestions } from "#ui/forms/CodeEditor/fetchCoreResourcesSuggestions"
import {
  InputSelect,
  type InputSelectValue,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useRuleEngine } from "./RuleEngineContext"

export function InputResourcePath({
  value,
  name,
}: {
  value: string | undefined
  name: string
}): React.JSX.Element {
  const { setPath, schemaType } = useRuleEngine()
  const { t } = useTranslation()

  const ref =
    useRef<
      SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>
    >(null)

  const mainResourceId =
    schemaType === "order-rules"
      ? "order"
      : schemaType === "price-rules"
        ? "price"
        : undefined

  const initialValues = uniqBy(
    presetPaths
      .filter(
        (path) => mainResourceId != null && path.startsWith(mainResourceId),
      )
      .map((field) => ({
        value: field,
        label: (t(`resource_paths.${field}`) as string).replace(
          "resource_paths.",
          "",
        ),
      })),
    "label",
  )

  return (
    <InputSelect
      ref={ref}
      name={name}
      initialValues={initialValues}
      defaultValue={
        value != null
          ? (initialValues.find((c) => c.value === value) ?? {
              value: value,
              label: value,
            })
          : undefined
      }
      asTextSearch={true}
      isCreatable={true}
      loadAsyncValues={async (inputValue) => {
        if (mainResourceId == null) {
          return []
        }

        const defaultValues = initialValues.filter((c) =>
          c.label.includes(inputValue),
        )

        const suggestions = (
          await fetchCoreResourcesSuggestions([mainResourceId], inputValue)
        )
          .filter((s) => s.value.startsWith(inputValue))
          .map((suggestion) => {
            const value =
              suggestion.type === "relationship" ||
              suggestion.value.endsWith(".metadata")
                ? `${suggestion.value}.`
                : suggestion.value

            return {
              value,
              label: value,
            }
          })

        const metadata = inputValue.includes(".metadata")
          ? [{ label: inputValue, value: inputValue }]
          : []

        const results = [...defaultValues, ...suggestions, ...metadata]

        return results
      }}
      onSelect={async (selection) => {
        if (isSingleValueSelected(selection)) {
          setPath(name, selection.value)

          if (selection.value.toString().endsWith(".")) {
            ref.current?.openMenu("first")
          }
        }
      }}
    />
  )
}

const presetPaths = [
  "order.billing_address.country_code",
  "order.country_code",
  "order.currency_code",
  "order.customer_email",
  "order.customer.email",
  "order.customer.customer_group.id",
  "order.customer.customer_group.name",
  "order.customer.tags.id",
  "order.customer.tags.name",
  "order.line_items.item_type",
  "order.line_items.line_item_options.sku_option.tags.name",
  "order.line_items.options_amount_cents",
  "order.line_items.quantity",
  "order.line_items.reference",
  "order.line_items.shipment.id",
  "order.line_items.shipment.shipping_method.id",
  "order.line_items.shipment.shipping_method.name",
  "order.line_items.shipment.shipping_method.reference",
  "order.line_items.sku_code",
  "order.line_items.sku.code",
  "order.line_items.sku.id",
  "order.line_items.sku.inventory.quantity",
  "order.line_items.sku.name",
  "order.line_items.sku.shipping_category.id",
  "order.line_items.sku.sku_lists.id",
  "order.line_items.sku.sku_lists.name",
  "order.line_items.sku.tags.id",
  "order.line_items.sku.tags.name",
  "order.line_items.unit_amount_cents",
  "order.market.code",
  "order.market.id",
  "order.shipments_count",
  "order.shipping_address.country_code",
  "order.subtotal_amount_cents",
  "order.tags.name",
  "order.total_amount_cents",
  "price.jwt_customer.email",
  "price.jwt_customer.tags.id",
  "price.jwt_customer.tags.name",
  "price.sku.sku_list_items.sku_list.id",
  "price.sku.sku_list_items.sku_list.name",
  "price.sku.code",
  "price.sku.id",
  "price.sku.tags.id",
  "price.sku.tags.name",
  "price.processed_at",
  "price.amount_cents",
] as const

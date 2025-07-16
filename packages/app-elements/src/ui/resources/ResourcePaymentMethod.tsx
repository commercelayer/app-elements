import type {
  CustomerPaymentSource,
  Order,
  PaymentMethod,
} from "@commercelayer/sdk"
import cn from "classnames"
import isEmpty from "lodash-es/isEmpty"
import { type FC, type ReactNode, useState } from "react"
import type { SetNonNullable, SetRequired } from "type-fest"
import { z } from "zod"
import { useTranslation } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"

export interface ResourcePaymentMethodProps {
  /**
   * Any resource that has `payment_source` or `payment_method` properties is actually eligible.
   * But we are only interested in `Order` and `CustomerPaymentSource` resources.
   */
  resource:
    | SetRequired<
        SetNonNullable<Partial<Order>, "payment_method">,
        "payment_method"
      >
    | SetRequired<
        SetNonNullable<CustomerPaymentSource, "payment_source">,
        "payment_source"
      >
  /**
   * When true and if `payment_source.payment_response` is present, enables the expandable content to show more details on the transaction.
   */
  showPaymentResponse?: boolean
  /**
   * Defines the style of the component. Default is `boxed`, with a light gray background and rounded corners.
   */
  variant?: "plain" | "boxed"
  /**
   * This will render a button on the right side of the row.
   */
  actionButton?: ReactNode
}

/**
 * Show info about the payment method from the given Order or CustomerPaymentSource.
 */
export const ResourcePaymentMethod: FC<ResourcePaymentMethodProps> = ({
  resource,
  showPaymentResponse = false,
  variant = "boxed",
  actionButton,
}) => {
  const [showMore, setShowMore] = useState(false)
  const { t } = useTranslation()
  const paymentInstrument = paymentInstrumentType.safeParse(
    resource.payment_source?.payment_instrument,
  )

  const paymentMethodName =
    "payment_method" in resource
      ? resource.payment_method?.name
      : resource.type === "customer_payment_sources"
        ? getPaymentMethodNameFromCustomerPaymentSource(resource)
        : undefined

  const avatarSrc = getPaymentMethodLogoSrc(
    resource.payment_method?.payment_source_type ??
      resource.payment_source?.type,
  )

  const paymentResponse =
    resource.payment_source != null &&
    "payment_response" in resource.payment_source &&
    !isEmpty(resource.payment_source.payment_response)
      ? resource.payment_source.payment_response
      : null

  if (paymentMethodName == null) {
    return null
  }

  return (
    <div
      className={cn({
        "bg-gray-50 rounded px-4": variant === "boxed",
      })}
    >
      <div className="flex gap-4 py-[14px] items-center">
        <img src={avatarSrc} alt={paymentMethodName} className="h-8" />
        <div className="flex gap-4 items-center justify-between w-full">
          <div className="flex flex-col gap-0">
            {paymentInstrument.success ? (
              <div>
                <Text weight="semibold">{paymentMethodName}</Text>
                <Text>{" · "}</Text>
                <Text weight="medium" variant="info">
                  {paymentInstrument.data.card_type != null ? (
                    <span>
                      {paymentInstrument.data.card_type}{" "}
                      {paymentInstrument.data.issuer_type}
                      {paymentInstrument.data.card_last_digits != null && (
                        <Spacer left="2" style={{ display: "inline-block" }}>
                          ··{paymentInstrument.data.card_last_digits}
                        </Spacer>
                      )}
                      {paymentInstrument.data.card_expiry_month != null &&
                        paymentInstrument.data.card_expiry_year != null && (
                          <Spacer left="1" style={{ display: "inline-block" }}>
                            {`${t("common.card_expires")} `}
                            {paymentInstrument.data.card_expiry_month}/
                            {paymentInstrument.data.card_expiry_year.slice(2)}
                          </Spacer>
                        )}
                    </span>
                  ) : (
                    paymentInstrument.data.issuer_type
                  )}
                </Text>
              </div>
            ) : (
              <Text tag="div" weight="semibold">
                {paymentMethodName}
              </Text>
            )}
            {paymentResponse != null && showPaymentResponse && (
              <Button
                onClick={() => {
                  setShowMore(!showMore)
                }}
                variant="link"
                size="mini"
                className="text-xs font-bold !text-gray-700"
                type="button"
              >
                {showMore ? t("common.show_less") : t("common.show_more")}
              </Button>
            )}
          </div>
          {actionButton != null && !showPaymentResponse && <>{actionButton}</>}
        </div>
      </div>

      {showMore && paymentResponse != null && showPaymentResponse ? (
        <div className="flex gap-4 pt-4 pb-2 overflow-hidden border-t border-dashed border-gray-200">
          <img
            src={avatarSrc}
            alt={paymentMethodName}
            className="h-8 opacity-0" // keep image hidden to set same left spacing of the first block
          />
          <div className="font-mono text-sm overflow-auto max-h-48">
            {Object.entries(paymentResponse).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold">{key}: </span>
                <span className="font-medium break-words overflow-hidden">
                  {typeof value === "string" || typeof value === "number"
                    ? value
                    : typeof value === "boolean"
                      ? `${value}`
                      : JSON.stringify(value).replaceAll(",", ", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const paymentInstrumentType = z.object({
  issuer_type: z.string(),
  card_type: z
    .string()
    .optional()
    .transform((brand) => {
      if (brand == null) {
        return brand
      }

      return brand
        .toLowerCase()
        .split(" ")
        .map((word) => {
          const firstLetter = word.charAt(0).toUpperCase()
          const rest = word.slice(1).toLowerCase()

          return firstLetter + rest
        })
        .join(" ")
    }),
  card_last_digits: z.string().optional(),
  card_expiry_month: z.string().optional(),
  card_expiry_year: z.string().optional(),
})

/**
 * Retrieve the logo URL based on the payment source type.
 */
export function getPaymentMethodLogoSrc(
  type?: PaymentMethod["payment_source_type"],
): string {
  const assetsUrl =
    "https://data.commercelayer.app/assets/images/icons/credit-cards/color"

  const logos: Record<PaymentMethod["payment_source_type"], string> = {
    adyen_payments: `${assetsUrl}/adyen.svg`,
    axerve_payments: `${assetsUrl}/axerve.svg`,
    braintree_payments: `${assetsUrl}/braintree.svg`,
    checkout_com_payments: `${assetsUrl}/checkout_com.svg`,
    external_payments: `${assetsUrl}/external.svg`,
    klarna_payments: `${assetsUrl}/klarna.svg`,
    paypal_payments: `${assetsUrl}/paypal.svg`,
    satispay_payments: `${assetsUrl}/satispay.svg`,
    stripe_payments: `${assetsUrl}/stripe.svg`,
    wire_transfers: `${assetsUrl}/manual.svg`,
  }

  const defaultLogo = `${assetsUrl}/credit-card.svg`
  if (type == null) {
    return defaultLogo
  }
  return logos[type] ?? defaultLogo
}

/**
 * Extracts the payment method name from a customer payment source.
 * It first tries to get it from the first payment method found in `payment_source.payment_methods` (if available).
 * Otherwise it tries to get it from a custom mapping of user-friendly names from the `payment_source.type`.
 */
function getPaymentMethodNameFromCustomerPaymentSource(
  customerPaymentSource: CustomerPaymentSource,
): string | undefined {
  const paymentSourceTypeNiceName = {
    adyen_payments: "Adyen",
    axerve_payments: "Axerve",
    braintree_payments: "Braintree",
    checkout_com_payments: "Checkout.com",
    klarna_payments: "Klarna",
    paypal_payments: "Paypal",
    satispay_payments: "Satispay",
    stripe_payments: "Stripe",
  }

  const paymentSource = customerPaymentSource.payment_source
  const paymentMethod =
    paymentSource != null &&
    "payment_methods" in paymentSource &&
    Array.isArray(paymentSource.payment_methods) &&
    paymentSource.payment_methods[0] != null
      ? (paymentSource.payment_methods[0] as PaymentMethod)
      : undefined

  const paymentMethodName =
    paymentMethod?.name ??
    paymentSourceTypeNiceName[
      paymentSource?.type as keyof typeof paymentSourceTypeNiceName
    ]

  return paymentMethodName
}

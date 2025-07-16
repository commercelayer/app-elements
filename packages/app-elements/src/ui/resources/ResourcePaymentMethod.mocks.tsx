import type { CustomerPaymentSource, Order } from "@commercelayer/sdk"

export const orderWithoutPaymentSourceResponse = {
  id: "ABCXFJAKO",
  type: "orders",
  created_at: "",
  updated_at: "",
  status: "approved",
  payment_status: "paid",
  fulfillment_status: "fulfilled",
  payment_method: {
    id: "xxxxx",
    type: "payment_methods",
    name: "Adyen Payment",
    payment_source_type: "adyen_payments",
    currency_code: "EUR",
    price_amount_cents: 0,
    price_amount_float: 0,
    formatted_price_amount: "€0,00",
    created_at: "",
    updated_at: "",
  },
  payment_source: {
    id: "abc123",
    type: "adyen_payments",
    public_key: null,
    payment_methods: {},
    mismatched_amounts: false,
    created_at: "",
    updated_at: "",
  },
} satisfies Order

export const orderWithPaymentSourceResponse = {
  id: "ABCXFJAKO",
  type: "orders",
  created_at: "",
  updated_at: "",
  status: "approved",
  payment_status: "paid",
  fulfillment_status: "fulfilled",
  payment_method: {
    id: "xxxxx",
    type: "payment_methods",
    name: "Adyen Payment",
    payment_source_type: "adyen_payments",
    currency_code: "EUR",
    price_amount_cents: 0,
    price_amount_float: 0,
    formatted_price_amount: "€0,00",
    created_at: "",
    updated_at: "",
  },
  payment_source: {
    id: "abc123",
    type: "adyen_payments",
    public_key: null,
    payment_methods: {
      paymentMethods: [
        {
          name: "Credit Card",
          type: "scheme",
          brands: [
            "visa",
            "mc",
            "amex",
            "cup",
            "diners",
            "discover",
            "jcb",
            "maestro",
          ],
          details: [
            {
              key: "encryptedCardNumber",
              type: "cardToken",
            },
            {
              key: "encryptedSecurityCode",
              type: "cardToken",
            },
            {
              key: "encryptedExpiryMonth",
              type: "cardToken",
            },
            {
              key: "encryptedExpiryYear",
              type: "cardToken",
            },
            {
              key: "holderName",
              type: "text",
              optional: true,
            },
          ],
        },
        {
          name: "PayPal",
          type: "paypal",
          configuration: {
            intent: "authorize",
            merchantId: "xxxxxxxx",
          },
        },
      ],
    },
    payment_response: {
      amount: {
        value: 400,
        currency: "EUR",
      },
      resultCode: "Authorised",
      fraudResult: {
        results: [
          {
            FraudCheckResult: {
              name: "Pre-Auth-Risk-Total",
              checkId: -1,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "AVSAuthResultCheck",
              checkId: 20,
              accountScore: 25,
            },
          },
          {
            FraudCheckResult: {
              name: "CVCAuthResultCheck",
              checkId: 25,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "LiabilityShiftCheck",
              checkId: 29,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "PaymentDetailRefCheck",
              checkId: 1,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperIpRefCheck",
              checkId: 6,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "IssuerRefCheck",
              checkId: 13,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "PmOwnerRefCheck",
              checkId: 27,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "PaymentDetailNonFraudRefCheck",
              checkId: 41,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperReferenceCheck",
              checkId: 56,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "EmailDomainRefCheck",
              checkId: 65,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "PaymentDetailCarteBancaireRefCheck",
              checkId: 75,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "PhoneNumberRefCheck",
              checkId: 66,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperEmailRefCheck",
              checkId: 26,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperAddressRefCheck",
              checkId: 40,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "CardChunkUsage",
              checkId: 2,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "PaymentDetailUsage",
              checkId: 3,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "HolderNameUsage",
              checkId: 4,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperIpUsage",
              checkId: 7,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperEmailUsage",
              checkId: 8,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperDetailsUsage",
              checkId: 37,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctCountryUsageByShopper",
              checkId: 46,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "BlockedCardsUsageByShopper",
              checkId: 47,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ChargebackCountByShopper",
              checkId: 48,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctShopperIpUsageByShopper",
              checkId: 49,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctShopperEmailUsageByShopper",
              checkId: 50,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctShopperReferenceUsageByShopper",
              checkId: 51,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctPaymentDetailUsageByShopper",
              checkId: 52,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctSharedShopperIpUsageByShopper",
              checkId: 53,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "DistinctSharedPaymentDetailUsageByShopper",
              checkId: 54,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperAuthorisedFrequency",
              checkId: 55,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "TransactionAmountVelocity",
              checkId: 64,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperConsecutiveRefusalsCheck",
              checkId: 70,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "LoyalShopperTrustCheck",
              checkId: 71,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "IPCountryReferral",
              checkId: 5,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperIpIssuingCountry",
              checkId: 9,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "HolderNameContainsNumber",
              checkId: 10,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "HolderNameIsOneWord",
              checkId: 11,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "IssuingCountryReferral",
              checkId: 15,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "BillingAddressDeliveryAddress",
              checkId: 57,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "TransactionAmountCheck",
              checkId: 63,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "EmailNameCheck",
              checkId: 74,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "EmailSyntaxCheck",
              checkId: 77,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "ShopperBehaviorCheck",
              checkId: 78,
              accountScore: 0,
            },
          },
          {
            FraudCheckResult: {
              name: "CustomFieldCheck",
              checkId: 82,
              accountScore: 0,
            },
          },
        ],
        accountScore: 25,
      },
      pspReference: "AKF9S9291SAA",
      additionalData: {
        cardSummary: "4242",
        paymentMethod: "amex",
        cardHolderName: "Ringo Starr",
        fraudResultType: "GREEN",
        fraudManualReview: "false",
        paymentMethodVariant: "amex",
      },
      merchantReference: "123456789",
    },
    mismatched_amounts: false,
    payment_instrument: {
      issuer_type: "credit card",
      card_type: "amex",
      card_last_digits: "4242",
      card_holder_name: "Ringo Starr",
    },
    created_at: "",
    updated_at: "",
  },
} satisfies Order

export const customerPaymentSource = {
  id: "gvXpwsjjdv",
  type: "customer_payment_sources",
  name: "braintree_payment #8404",
  created_at: "",
  updated_at: "",
  payment_source: {
    id: "ZdZqLswKYb",
    type: "braintree_payments",
    client_token: "",
    payment_method_nonce: "",
    payment_id: null,
    local: null,
    options: {
      id: "",
      card: {
        brand: "visa",
        last4: "0004",
        exp_year: "2030",
        exp_month: "10",
      },
      payment_method_token: "abc123",
    },
    payment_instrument: {
      issuer: "unknown",
      issuer_type: "braintree",
      card_type: "visa",
      card_last_digits: "0004",
      card_expiry_month: "10",
      card_expiry_year: "2030",
    },
    created_at: "",
    updated_at: "",
  },
} satisfies CustomerPaymentSource

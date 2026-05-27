import { delay, HttpResponse, http } from "msw"

const allEventStores = http.get(
  "https://mock.localhost/api/event_stores",
  async ({ request }) => {
    const url = new URL(request.url)
    const pageNumber = url.searchParams.get("page[number]")

    await delay(1000)

    if (pageNumber === "2") {
      return HttpResponse.json({
        data: [
          {
            id: "LmNoPqRsUv",
            type: "event_stores",
            links: {
              self: "https://mock.localhost/api/event_stores/LmNoPqRsUv",
            },
            attributes: {
              resource_id: "NMWYhbGorj",
              resource_type: "orders",
              created_at: "2025-03-01T09:00:00.000Z",
              updated_at: "2025-03-01T09:00:00.000Z",
              event: "create",
              payload: {
                warehouse_id: "WH-001",
                inventory_reserved: true,
              },
              who: {
                application: {
                  id: "fake-application-id",
                  client_id: "",
                  kind: "sales_channel",
                },
              },
            },
          },
          {
            id: "VwXyZaBcDe",
            type: "event_stores",
            links: {
              self: "https://mock.localhost/api/event_stores/VwXyZaBcDe",
            },
            attributes: {
              resource_id: "NMWYhbGorj",
              resource_type: "orders",
              created_at: "2025-03-01T10:45:00.000Z",
              updated_at: "2025-03-01T10:45:00.000Z",
              event: "update",
              payload: {
                customer_tier: {
                  from: "bronze",
                  to: "silver",
                },
              },
              who: {
                application: {
                  id: "fake-application-id",
                  client_id: "",
                  kind: "sales_channel",
                },
              },
            },
          },
          {
            id: "FgHiJkLmNo",
            type: "event_stores",
            links: {
              self: "https://mock.localhost/api/event_stores/FgHiJkLmNo",
            },
            attributes: {
              resource_id: "NMWYhbGorj",
              resource_type: "orders",
              created_at: "2025-02-15T09:00:00.000Z",
              updated_at: "2025-02-15T09:00:00.000Z",
              event: "update",
              payload: {
                payment_status: {
                  from: "pending",
                  to: "authorized",
                },
              },
              who: {
                application: {
                  id: "fake-application-id",
                  client_id: "",
                  kind: "sales_channel",
                },
              },
            },
          },
          {
            id: "PqRsTuVwXy",
            type: "event_stores",
            links: {
              self: "https://mock.localhost/api/event_stores/PqRsTuVwXy",
            },
            attributes: {
              resource_id: "NMWYhbGorj",
              resource_type: "orders",
              created_at: "2025-02-15T11:00:00.000Z",
              updated_at: "2025-02-15T11:00:00.000Z",
              event: "create",
              payload: {
                order_id: "ORD-56789",
                customer_id: "CUST-123",
              },
              who: {
                application: {
                  id: "fake-application-id",
                  client_id: "",
                  kind: "sales_channel",
                },
              },
            },
          },
          {
            id: "ZaBcDeFgHi",
            type: "event_stores",
            links: {
              self: "https://mock.localhost/api/event_stores/ZaBcDeFgHi",
            },
            attributes: {
              resource_id: "NMWYhbGorj",
              resource_type: "orders",
              created_at: "2025-02-01T09:00:00.000Z",
              updated_at: "2025-02-01T09:00:00.000Z",
              event: "update",
              payload: {
                fulfillment_status: {
                  from: "unfulfilled",
                  to: "in_progress",
                },
              },
              who: {
                application: {
                  id: "fake-application-id",
                  client_id: "",
                  kind: "sales_channel",
                },
              },
            },
          },
        ],
        meta: { record_count: 30, page_count: 2 },
        links: {
          first:
            "https://mock.localhost/api/event_stores?page%5Bnumber%5D=1&page%5Bsize%5D=25",
          next: "https://mock.localhost/api/event_stores?page%5Bnumber%5D=2&page%5Bsize%5D=25",
          last: "https://mock.localhost/api/event_stores?page%5Bnumber%5D=2&page%5Bsize%5D=25",
        },
      })
    }

    // Page 1 (default)
    return HttpResponse.json({
      data: [
        {
          id: "ZyyESNNPLG",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/ZyyESNNPLG",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-08-15T10:00:00.000Z",
            updated_at: "2025-08-15T10:00:00.000Z",
            event: "update",
            payload: {
              fulfillment_status: {
                from: "unfulfilled",
                to: "in_progress",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "ZyyESNNPLZ",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/ZyyESNNPLZ",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-08-15T11:30:00.000Z",
            updated_at: "2025-08-15T11:30:00.000Z",
            event: "update",
            payload: {
              fulfillment_status: {
                from: "unfulfilled",
                to: "in_progress",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "nQrOSKNJpa",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/nQrOSKNJpa",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-08-01T09:00:00.000Z",
            updated_at: "2025-08-01T09:00:00.000Z",
            event: "create",
            payload: {
              fulfillment_status: {
                from: "unfulfilled",
                to: "in_progress",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "AbCdEfGhIj",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/AbCdEfGhIj",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-08-01T10:15:00.000Z",
            updated_at: "2025-08-01T10:15:00.000Z",
            event: "update",
            payload: {
              status: {
                from: "pending",
                to: "confirmed",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "KlMnOpQrSt",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/KlMnOpQrSt",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-08-01T11:45:00.000Z",
            updated_at: "2025-08-01T11:45:00.000Z",
            event: "update",
            payload: {
              payment_status: {
                from: "unpaid",
                to: "paid",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "UvWxYzAbCd",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/UvWxYzAbCd",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-07-15T09:00:00.000Z",
            updated_at: "2025-07-15T09:00:00.000Z",
            event: "create",
            payload: {
              order_id: "ORD-12345",
              total: "199.99",
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "EfGhIjKlMn",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/EfGhIjKlMn",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-07-15T10:30:00.000Z",
            updated_at: "2025-07-15T10:30:00.000Z",
            event: "update",
            payload: {
              fulfillment_status: {
                from: "in_progress",
                to: "fulfilled",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "OpQrStUvWx",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/OpQrStUvWx",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-07-01T08:00:00.000Z",
            updated_at: "2025-07-01T08:00:00.000Z",
            event: "update",
            payload: {
              notes: {
                from: "",
                to: "Important order",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "YzAbCdEfGh",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/YzAbCdEfGh",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-07-01T13:00:00.000Z",
            updated_at: "2025-07-01T13:00:00.000Z",
            event: "create",
            payload: {
              order_status: "new",
              items_count: 3,
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "IjKlMnOpQr",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/IjKlMnOpQr",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-06-15T09:00:00.000Z",
            updated_at: "2025-06-15T09:00:00.000Z",
            event: "update",
            payload: {
              shipping_address: {
                from: "old_address",
                to: "new_address",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "StUvWxYzAb",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/StUvWxYzAb",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-06-15T10:45:00.000Z",
            updated_at: "2025-06-15T10:45:00.000Z",
            event: "update",
            payload: {
              coupon_applied: {
                code: "SUMMER20",
                discount: "20",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "CdEfGhIjKl",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/CdEfGhIjKl",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-06-15T14:15:00.000Z",
            updated_at: "2025-06-15T14:15:00.000Z",
            event: "create",
            payload: {
              order_type: "standard",
              express_shipping: false,
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "MnOpQrStUv",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/MnOpQrStUv",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-06-01T09:00:00.000Z",
            updated_at: "2025-06-01T09:00:00.000Z",
            event: "update",
            payload: {
              customer_notification_sent: true,
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "WxYzAbCdEf",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/WxYzAbCdEf",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-06-01T11:30:00.000Z",
            updated_at: "2025-06-01T11:30:00.000Z",
            event: "update",
            payload: {
              fulfillment_status: {
                from: "unfulfilled",
                to: "in_progress",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "GhIjKlMnOp",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/GhIjKlMnOp",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-05-15T09:00:00.000Z",
            updated_at: "2025-05-15T09:00:00.000Z",
            event: "create",
            payload: {
              customer_email: "customer@example.com",
              order_total: "299.99",
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "QrStUvWxYz",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/QrStUvWxYz",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-05-15T10:45:00.000Z",
            updated_at: "2025-05-15T10:45:00.000Z",
            event: "update",
            payload: {
              payment_method: {
                from: "credit_card",
                to: "paypal",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "AbCdEfGhIk",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/AbCdEfGhIk",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-05-15T14:00:00.000Z",
            updated_at: "2025-05-15T14:00:00.000Z",
            event: "update",
            payload: {
              return_status: {
                from: "none",
                to: "requested",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "LmNoPqRsTs",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/LmNoPqRsTs",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-05-01T08:00:00.000Z",
            updated_at: "2025-05-01T08:00:00.000Z",
            event: "create",
            payload: {
              order_created_from: "storefront",
              promotional_code: "WELCOME10",
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "TuVwXyZaBc",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/TuVwXyZaBc",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-05-01T12:30:00.000Z",
            updated_at: "2025-05-01T12:30:00.000Z",
            event: "update",
            payload: {
              tracking_number: {
                from: "",
                to: "TRACK123456",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "DeFgHiJkLm",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/DeFgHiJkLm",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-04-15T09:00:00.000Z",
            updated_at: "2025-04-15T09:00:00.000Z",
            event: "update",
            payload: {
              fulfillment_status: {
                from: "fulfilled",
                to: "closed",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "NoPqRsTuVw",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/NoPqRsTuVw",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-04-15T11:15:00.000Z",
            updated_at: "2025-04-15T11:15:00.000Z",
            event: "create",
            payload: {
              billing_address_id: "ADDR-789",
              shipping_address_id: "ADDR-790",
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "XyZaBcDeFg",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/XyZaBcDeFg",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-04-01T09:00:00.000Z",
            updated_at: "2025-04-01T09:00:00.000Z",
            event: "update",
            payload: {
              priority: {
                from: "normal",
                to: "urgent",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "HiJkLmNoPq",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/HiJkLmNoPq",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-04-01T13:00:00.000Z",
            updated_at: "2025-04-01T13:00:00.000Z",
            event: "create",
            payload: {
              order_source: "web",
              device_type: "mobile",
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "RsTuVwXyZa",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/RsTuVwXyZa",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-03-15T09:00:00.000Z",
            updated_at: "2025-03-15T09:00:00.000Z",
            event: "update",
            payload: {
              gift_message: {
                from: "",
                to: "Happy Birthday!",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
        {
          id: "BcDeFgHiJk",
          type: "event_stores",
          links: {
            self: "https://mock.localhost/api/event_stores/BcDeFgHiJk",
          },
          attributes: {
            resource_id: "NMWYhbGorj",
            resource_type: "orders",
            created_at: "2025-03-15T11:30:00.000Z",
            updated_at: "2025-03-15T11:30:00.000Z",
            event: "update",
            payload: {
              fulfillment_status: {
                from: "in_progress",
                to: "fulfilled",
              },
            },
            who: {
              application: {
                id: "fake-application-id",
                client_id: "",
                kind: "sales_channel",
              },
            },
          },
        },
      ],
      meta: { record_count: 30, page_count: 2 },
      links: {
        first:
          "https://mock.localhost/api/event_stores?page%5Bnumber%5D=1&page%5Bsize%5D=25",
        next: "https://mock.localhost/api/event_stores?page%5Bnumber%5D=2&page%5Bsize%5D=25",
        last: "https://mock.localhost/api/event_stores?page%5Bnumber%5D=2&page%5Bsize%5D=25",
      },
    })
  },
)

export default [allEventStores]

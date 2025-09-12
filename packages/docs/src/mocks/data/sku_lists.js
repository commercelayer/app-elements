import { delay, HttpResponse, http } from "msw"

const allSkuLists = http.get(
  "https://mock.localhost/api/sku_lists?sort=name&page[number]=1&page[size]=25",
  async () => {
    await delay(1000)
    return HttpResponse.json({
      data: [
        {
          id: "rbqjZIRkyj",
          type: "sku_lists",
          links: {
            self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj",
          },
          attributes: {
            name: "Product excluded staff sale",
            slug: "product-excluded-staff-sale",
            description: null,
            image_url: null,
            manual: true,
            sku_code_regex: null,
            created_at: "2025-03-24T16:30:13.327Z",
            updated_at: "2025-03-26T14:53:47.629Z",
            reference: null,
            reference_origin: null,
            metadata: {},
          },
          relationships: {
            customer: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/customer",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/customer",
              },
            },
            skus: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/skus",
                related: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/skus",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/sku_list_items",
              },
            },
            bundles: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/bundles",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/bundles",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/attachments",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/links",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/links",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/versions",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/versions",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/sku_lists/rbqjZIRkyj/relationships/event_stores",
                related:
                  "https://mock.localhost/api/sku_lists/rbqjZIRkyj/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "YyrQYFmLRk",
            trace_id:
              "ebc6ac4e7fec92ffb772a1766e0dd6f905749143e5e3ace4a9c441ba819ca7a9",
          },
        },
        {
          id: "AnVvZIvanz",
          type: "sku_lists",
          links: {
            self: "https://mock.localhost/api/sku_lists/AnVvZIvanz",
          },
          attributes: {
            name: "DONOT DISCOUNT Polos",
            slug: "polos",
            description: null,
            image_url: null,
            manual: true,
            sku_code_regex: null,
            created_at: "2024-06-18T10:13:30.158Z",
            updated_at: "2025-01-23T15:10:48.226Z",
            reference: null,
            reference_origin: null,
            metadata: {},
          },
          relationships: {
            customer: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/customer",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/customer",
              },
            },
            skus: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/skus",
                related: "https://mock.localhost/api/sku_lists/AnVvZIvanz/skus",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/sku_list_items",
              },
            },
            bundles: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/bundles",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/bundles",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/attachments",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/links",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/links",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/versions",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/versions",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/sku_lists/AnVvZIvanz/relationships/event_stores",
                related:
                  "https://mock.localhost/api/sku_lists/AnVvZIvanz/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "YyrQYFmLRk",
            trace_id:
              "ebc6ac4e7fec92ffb772a1766e0dd6f905749143e5e3ace4a9c441ba819ca7a9",
          },
        },
        {
          id: "XJjEpIRryP",
          type: "sku_lists",
          links: {
            self: "https://mock.localhost/api/sku_lists/XJjEpIRryP",
          },
          attributes: {
            name: "Free Tshirt",
            slug: "free-tshirt",
            description: null,
            image_url: null,
            manual: true,
            sku_code_regex: null,
            created_at: "2024-06-18T10:13:04.777Z",
            updated_at: "2024-06-18T10:13:05.232Z",
            reference: null,
            reference_origin: null,
            metadata: {},
          },
          relationships: {
            customer: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/customer",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/customer",
              },
            },
            skus: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/skus",
                related: "https://mock.localhost/api/sku_lists/XJjEpIRryP/skus",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/sku_list_items",
              },
            },
            bundles: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/bundles",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/bundles",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/attachments",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/links",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/links",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/versions",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/versions",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/sku_lists/XJjEpIRryP/relationships/event_stores",
                related:
                  "https://mock.localhost/api/sku_lists/XJjEpIRryP/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "YyrQYFmLRk",
            trace_id:
              "ebc6ac4e7fec92ffb772a1766e0dd6f905749143e5e3ace4a9c441ba819ca7a9",
          },
        },
        {
          id: "wJWxZIAdnK",
          type: "sku_lists",
          links: {
            self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK",
          },
          attributes: {
            name: "SKUs with an out of stock",
            slug: "skus-with-an-out-of-stock",
            description: "List of skus with an out of stock",
            image_url:
              "https://res.cloudinary.com/commercelayer/image/upload/v1681465805/demo-store/assets/white-glossy-mug-15oz-valentines-day.png",
            manual: true,
            sku_code_regex: null,
            created_at: "2024-06-18T09:04:02.238Z",
            updated_at: "2024-06-18T09:04:02.238Z",
            reference: "sku_list_2",
            reference_origin: "CLI",
            metadata: {},
          },
          relationships: {
            customer: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/customer",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/customer",
              },
            },
            skus: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/skus",
                related: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/skus",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/sku_list_items",
              },
            },
            bundles: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/bundles",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/bundles",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/attachments",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/links",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/links",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/versions",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/versions",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/sku_lists/wJWxZIAdnK/relationships/event_stores",
                related:
                  "https://mock.localhost/api/sku_lists/wJWxZIAdnK/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "YyrQYFmLRk",
            trace_id:
              "ebc6ac4e7fec92ffb772a1766e0dd6f905749143e5e3ace4a9c441ba819ca7a9",
          },
        },
        {
          id: "qJxWoIZByY",
          type: "sku_lists",
          links: {
            self: "https://mock.localhost/api/sku_lists/qJxWoIZByY",
          },
          attributes: {
            name: "SKUs with promo",
            slug: "skus-with-promo",
            description: "List of skus with a promo",
            image_url:
              "https://res.cloudinary.com/commercelayer/image/upload/v1681465805/demo-store/assets/white-glossy-mug-15oz-valentines-day.png",
            manual: true,
            sku_code_regex: null,
            created_at: "2024-06-18T09:04:00.622Z",
            updated_at: "2024-06-18T10:47:24.865Z",
            reference: "sku_list_1",
            reference_origin: "CLI",
            metadata: {},
          },
          relationships: {
            customer: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/customer",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/customer",
              },
            },
            skus: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/skus",
                related: "https://mock.localhost/api/sku_lists/qJxWoIZByY/skus",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/sku_list_items",
              },
            },
            bundles: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/bundles",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/bundles",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/attachments",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/links",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/links",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/versions",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/versions",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/sku_lists/qJxWoIZByY/relationships/event_stores",
                related:
                  "https://mock.localhost/api/sku_lists/qJxWoIZByY/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "YyrQYFmLRk",
            trace_id:
              "ebc6ac4e7fec92ffb772a1766e0dd6f905749143e5e3ace4a9c441ba819ca7a9",
          },
        },
      ],
      meta: { record_count: 5, page_count: 1 },
      links: {
        first:
          "https://mock.localhost/api/sku_lists?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name",
        last: "https://mock.localhost/api/sku_lists?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name",
      },
    })
  },
)

export default [allSkuLists]

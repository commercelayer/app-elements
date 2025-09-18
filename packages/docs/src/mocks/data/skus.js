import { delay, HttpResponse, http } from "msw"

const allSkus = http.get(
  "https://mock.localhost/api/skus?sort=code&page[number]=1&page[size]=25",
  async () => {
    await delay(1000)
    return HttpResponse.json({
      data: [
        {
          id: "ZyyESNNPLG",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZyyESNNPLG",
          },
          attributes: {
            code: "5PANECAP000000FFFFFFSXXX",
            name: "Black Five-Panel Cap with White Logo (S)",
            description: null,
            image_url:
              "http://localhost:8055/assets/0b5a105d-e04a-4288-9719-dad3d68ccdf2",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2025-07-04T10:17:57.865Z",
            updated_at: "2025-07-04T10:17:57.865Z",
            reference: null,
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/prices",
                related: "https://mock.localhost/api/skus/ZyyESNNPLG/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZyyESNNPLG/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/links",
                related: "https://mock.localhost/api/skus/ZyyESNNPLG/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/events",
                related: "https://mock.localhost/api/skus/ZyyESNNPLG/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/tags",
                related: "https://mock.localhost/api/skus/ZyyESNNPLG/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/versions",
                related: "https://mock.localhost/api/skus/ZyyESNNPLG/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZyyESNNPLG/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZyyESNNPLG/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nQrOSKNJpa",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nQrOSKNJpa",
          },
          attributes: {
            code: "5PANECAP000000FFFFFFXXXX",
            name: "Black Five-Panel Cap with White Logo",
            description:
              "Soft-structured, five-panel, low-profile cap. 100% cotton, metal eyelets, nylon strap clip closure.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/5PANECAP000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: 100.0,
            unit_of_weight: "gr",
            hs_tariff_number: "",
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.348Z",
            updated_at: "2025-09-02T08:08:39.863Z",
            reference: "sku_1",
            reference_origin: "",
            jwt_custom_claim: null,
            metadata: { minimum_value: "200" },
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/prices",
                related: "https://mock.localhost/api/skus/nQrOSKNJpa/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nQrOSKNJpa/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/links",
                related: "https://mock.localhost/api/skus/nQrOSKNJpa/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/events",
                related: "https://mock.localhost/api/skus/nQrOSKNJpa/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/tags",
                related: "https://mock.localhost/api/skus/nQrOSKNJpa/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/versions",
                related: "https://mock.localhost/api/skus/nQrOSKNJpa/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nQrOSKNJpa/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nQrOSKNJpa/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "BgvMSwxLEA",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/BgvMSwxLEA",
          },
          attributes: {
            code: "5PANECAP9D9CA1FFFFFFXXXX",
            name: "Gray Five-Panel Cap with White Logo",
            description:
              "Soft-structured, five-panel, low-profile cap. 100% cotton, metal eyelets, nylon strap clip closure.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/5PANECAP9D9CA1FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.368Z",
            updated_at: "2025-09-02T08:08:49.373Z",
            reference: "sku_2",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/prices",
                related: "https://mock.localhost/api/skus/BgvMSwxLEA/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/BgvMSwxLEA/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/links",
                related: "https://mock.localhost/api/skus/BgvMSwxLEA/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/events",
                related: "https://mock.localhost/api/skus/BgvMSwxLEA/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/tags",
                related: "https://mock.localhost/api/skus/BgvMSwxLEA/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/versions",
                related: "https://mock.localhost/api/skus/BgvMSwxLEA/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/BgvMSwxLEA/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/BgvMSwxLEA/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "WYqPSwbPAe",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/WYqPSwbPAe",
          },
          attributes: {
            code: "APRONXXX000000FFFFFFXXXX",
            name: "Black Apron with White Logo",
            description:
              "This apron has a neck loop and long ties that are easy to adjust for any size. The two front pockets provide additional space for some much-needed cooking utensils, and together with our embroidered logo give the apron a sleek premium look.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/APRONXXX000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.381Z",
            updated_at: "2025-05-07T13:27:50.888Z",
            reference: "sku_3",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/prices",
                related: "https://mock.localhost/api/skus/WYqPSwbPAe/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/WYqPSwbPAe/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/links",
                related: "https://mock.localhost/api/skus/WYqPSwbPAe/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/events",
                related: "https://mock.localhost/api/skus/WYqPSwbPAe/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/tags",
                related: "https://mock.localhost/api/skus/WYqPSwbPAe/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/versions",
                related: "https://mock.localhost/api/skus/WYqPSwbPAe/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/WYqPSwbPAe/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/WYqPSwbPAe/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "WPwySKJvgv",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/WPwySKJvgv",
          },
          attributes: {
            code: "APRONXXXFFFFFF000000XXXX",
            name: "White Apron with Black Logo",
            description:
              "This apron has a neck loop and long ties that are easy to adjust for any size. The two front pockets provide additional space for some much-needed cooking utensils, and together with our embroidered logo give the apron a sleek premium look.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/APRONXXXFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.397Z",
            updated_at: "2025-05-07T13:27:50.900Z",
            reference: "sku_4",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/prices",
                related: "https://mock.localhost/api/skus/WPwySKJvgv/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/WPwySKJvgv/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/links",
                related: "https://mock.localhost/api/skus/WPwySKJvgv/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/events",
                related: "https://mock.localhost/api/skus/WPwySKJvgv/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/tags",
                related: "https://mock.localhost/api/skus/WPwySKJvgv/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/versions",
                related: "https://mock.localhost/api/skus/WPwySKJvgv/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/WPwySKJvgv/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/WPwySKJvgv/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "BxAkSGLweb",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/BxAkSGLweb",
          },
          attributes: {
            code: "BABYBIBXA19D9D000000XXXX",
            name: "Baby's Gray Bib with Black Logo",
            description:
              'Avoid getting food stains on child’s clothes with this baby bib. The reinforced hook & loop closure makes it easy to put on, but hard for baby to take off. 4x4" embroidered logo.',
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BABYBIBXA19D9D000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.412Z",
            updated_at: "2025-05-07T13:27:50.914Z",
            reference: "sku_5",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/prices",
                related: "https://mock.localhost/api/skus/BxAkSGLweb/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/BxAkSGLweb/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/links",
                related: "https://mock.localhost/api/skus/BxAkSGLweb/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/events",
                related: "https://mock.localhost/api/skus/BxAkSGLweb/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/tags",
                related: "https://mock.localhost/api/skus/BxAkSGLweb/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/versions",
                related: "https://mock.localhost/api/skus/BxAkSGLweb/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/BxAkSGLweb/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/BxAkSGLweb/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nprzSgzrxd",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nprzSgzrxd",
          },
          attributes: {
            code: "BACKPACK000000FFFFFFXXXX",
            name: "Black Backpack with White Logo",
            description:
              "Medium size backpack with plenty of room plus a big inner pocket, a separate section for a 15'' laptop, a front pocket, and a hidden pocket at the back. Made of a water-resistant material. The soft, padded mesh material on the back and the black handles make it perfect for daily use or sports activities.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BACKPACK000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.427Z",
            updated_at: "2025-08-06T13:20:35.934Z",
            reference: "sku_6",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/prices",
                related: "https://mock.localhost/api/skus/nprzSgzrxd/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nprzSgzrxd/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/links",
                related: "https://mock.localhost/api/skus/nprzSgzrxd/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/events",
                related: "https://mock.localhost/api/skus/nprzSgzrxd/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/tags",
                related: "https://mock.localhost/api/skus/nprzSgzrxd/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/versions",
                related: "https://mock.localhost/api/skus/nprzSgzrxd/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nprzSgzrxd/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nprzSgzrxd/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "WEPdSkRLVg",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/WEPdSkRLVg",
          },
          attributes: {
            code: "BACKPACK818488000000XXXX",
            name: "Gray Backpack with Black Logo",
            description:
              "Two-color backpack made from a water-resistant material. It has a soft, padded back and a top carry handle, making it the perfect small size backpack for daily use or sports. Embroidered logo.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BACKPACK818488000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.441Z",
            updated_at: "2025-05-07T13:27:50.954Z",
            reference: "sku_7",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/prices",
                related: "https://mock.localhost/api/skus/WEPdSkRLVg/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/WEPdSkRLVg/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/links",
                related: "https://mock.localhost/api/skus/WEPdSkRLVg/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/events",
                related: "https://mock.localhost/api/skus/WEPdSkRLVg/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/tags",
                related: "https://mock.localhost/api/skus/WEPdSkRLVg/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/versions",
                related: "https://mock.localhost/api/skus/WEPdSkRLVg/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/WEPdSkRLVg/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/WEPdSkRLVg/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "ZNRJSaJrPa",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZNRJSaJrPa",
          },
          attributes: {
            code: "BACKPACKFFFFFF000000XXXX",
            name: "White Backpack with Black Logo",
            description:
              "Medium size backpack with plenty of room plus a big inner pocket, a separate section for a 15'' laptop, a front pocket, and a hidden pocket at the back. Made of a water-resistant material. The soft, padded mesh material on the back and the black handles make it perfect for daily use or sports activities.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BACKPACKFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.458Z",
            updated_at: "2025-05-07T13:27:50.968Z",
            reference: "sku_8",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/prices",
                related: "https://mock.localhost/api/skus/ZNRJSaJrPa/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZNRJSaJrPa/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/links",
                related: "https://mock.localhost/api/skus/ZNRJSaJrPa/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/events",
                related: "https://mock.localhost/api/skus/ZNRJSaJrPa/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/tags",
                related: "https://mock.localhost/api/skus/ZNRJSaJrPa/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/versions",
                related: "https://mock.localhost/api/skus/ZNRJSaJrPa/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZNRJSaJrPa/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZNRJSaJrPa/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "ZeDdSQJAbz",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZeDdSQJAbz",
          },
          attributes: {
            code: "BASEBHAT000000FFFFFFXXXX",
            name: "Black Baseball Hat with White Logo",
            description:
              "Step up your accessory game with a new washed twill dad cap. Pair our embroidery logo design with a sporty feel and create a unique premium baseball hat that's bound to become a favorite.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.476Z",
            updated_at: "2025-09-02T08:09:01.812Z",
            reference: "sku_9",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/prices",
                related: "https://mock.localhost/api/skus/ZeDdSQJAbz/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZeDdSQJAbz/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/links",
                related: "https://mock.localhost/api/skus/ZeDdSQJAbz/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/events",
                related: "https://mock.localhost/api/skus/ZeDdSQJAbz/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/tags",
                related: "https://mock.localhost/api/skus/ZeDdSQJAbz/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/versions",
                related: "https://mock.localhost/api/skus/ZeDdSQJAbz/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZeDdSQJAbz/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZeDdSQJAbz/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nkGgSabVLL",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nkGgSabVLL",
          },
          attributes: {
            code: "BASEBHATFFFFFF000000XXXX",
            name: "White Baseball Hat with Black Logo",
            description:
              "Step up your accessory game with a new washed twill dad cap. Pair our embroidery logo design with a sporty feel and create a unique premium baseball hat that's bound to become a favorite.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BASEBHATFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.491Z",
            updated_at: "2025-09-02T08:09:11.294Z",
            reference: "sku_10",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/prices",
                related: "https://mock.localhost/api/skus/nkGgSabVLL/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nkGgSabVLL/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/links",
                related: "https://mock.localhost/api/skus/nkGgSabVLL/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/events",
                related: "https://mock.localhost/api/skus/nkGgSabVLL/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/tags",
                related: "https://mock.localhost/api/skus/nkGgSabVLL/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/versions",
                related: "https://mock.localhost/api/skus/nkGgSabVLL/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nkGgSabVLL/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nkGgSabVLL/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "BmDzSXYxdl",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/BmDzSXYxdl",
          },
          attributes: {
            code: "BEACHAIR000000FFFFFFXXXX",
            name: "Black Bean Chair with White Logo",
            description:
              "Bean bags are the ultimate interior design item to have, and this one's as good as they come! Comfy, sturdy, with a big all-over printed logo.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BEACHAIR000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.505Z",
            updated_at: "2025-05-07T13:27:51.021Z",
            reference: "sku_11",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/prices",
                related: "https://mock.localhost/api/skus/BmDzSXYxdl/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/BmDzSXYxdl/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/links",
                related: "https://mock.localhost/api/skus/BmDzSXYxdl/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/events",
                related: "https://mock.localhost/api/skus/BmDzSXYxdl/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/tags",
                related: "https://mock.localhost/api/skus/BmDzSXYxdl/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/versions",
                related: "https://mock.localhost/api/skus/BmDzSXYxdl/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/BmDzSXYxdl/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/BmDzSXYxdl/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "BDklSXzAKm",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/BDklSXzAKm",
          },
          attributes: {
            code: "BEACHAIRFFFFFF000000XXXX",
            name: "White Bean Chair with Black Logo",
            description:
              "Bean bags are the ultimate interior design item to have, and this one's as good as they come! Comfy, sturdy, with a big all-over printed logo.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BEACHAIRFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.520Z",
            updated_at: "2025-05-07T13:27:51.034Z",
            reference: "sku_12",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/prices",
                related: "https://mock.localhost/api/skus/BDklSXzAKm/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/BDklSXzAKm/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/links",
                related: "https://mock.localhost/api/skus/BDklSXzAKm/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/events",
                related: "https://mock.localhost/api/skus/BDklSXzAKm/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/tags",
                related: "https://mock.localhost/api/skus/BDklSXzAKm/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/versions",
                related: "https://mock.localhost/api/skus/BDklSXzAKm/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/BDklSXzAKm/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/BDklSXzAKm/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nlwzSgevyM",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nlwzSgevyM",
          },
          attributes: {
            code: "BEACHBAG000000FFFFFFXXXX",
            name: "Black Beach Bag with White Logo",
            description:
              "Meet your companion for a sunny summer day — our beach bag! It's large, comfy, and you can match it with our towel to create the perfect beach combo.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BEACHBAG000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.537Z",
            updated_at: "2025-05-07T13:27:51.046Z",
            reference: "sku_13",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/prices",
                related: "https://mock.localhost/api/skus/nlwzSgevyM/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nlwzSgevyM/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/links",
                related: "https://mock.localhost/api/skus/nlwzSgevyM/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/events",
                related: "https://mock.localhost/api/skus/nlwzSgevyM/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/tags",
                related: "https://mock.localhost/api/skus/nlwzSgevyM/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/versions",
                related: "https://mock.localhost/api/skus/nlwzSgevyM/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nlwzSgevyM/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nlwzSgevyM/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "ZdplSqXgOw",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZdplSqXgOw",
          },
          attributes: {
            code: "BEACHBAGFFFFFF000000XXXX",
            name: "White Beach Bag with Black Logo",
            description:
              "Meet your companion for a sunny summer day — our beach bag! It's large, comfy, and you can match it with our towel to create the perfect beach combo.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BEACHBAGFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.550Z",
            updated_at: "2025-05-07T13:27:51.061Z",
            reference: "sku_14",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/prices",
                related: "https://mock.localhost/api/skus/ZdplSqXgOw/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZdplSqXgOw/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/links",
                related: "https://mock.localhost/api/skus/ZdplSqXgOw/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/events",
                related: "https://mock.localhost/api/skus/ZdplSqXgOw/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/tags",
                related: "https://mock.localhost/api/skus/ZdplSqXgOw/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/versions",
                related: "https://mock.localhost/api/skus/ZdplSqXgOw/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZdplSqXgOw/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZdplSqXgOw/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "ZorzSOjdkm",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZorzSOjdkm",
          },
          attributes: {
            code: "BEANIEXX000000FFFFFFXXXX",
            name: "Black Beanie with White Logo",
            description:
              "Soft double-layered customizable beanie. 95% polyester, 5% spandex. Regular fit. Accurately printed, cut, and hand-sewn.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BEANIEXX000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.564Z",
            updated_at: "2025-09-02T08:09:31.495Z",
            reference: "sku_15",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/prices",
                related: "https://mock.localhost/api/skus/ZorzSOjdkm/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZorzSOjdkm/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/links",
                related: "https://mock.localhost/api/skus/ZorzSOjdkm/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/events",
                related: "https://mock.localhost/api/skus/ZorzSOjdkm/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/tags",
                related: "https://mock.localhost/api/skus/ZorzSOjdkm/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/versions",
                related: "https://mock.localhost/api/skus/ZorzSOjdkm/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZorzSOjdkm/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZorzSOjdkm/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nMPOSDblxk",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nMPOSDblxk",
          },
          attributes: {
            code: "BEANIEXXFFFFFF000000XXXX",
            name: "White Beanie with Black Logo",
            description:
              "Soft double-layered customizable beanie. 95% polyester, 5% spandex. Regular fit. Accurately printed, cut, and hand-sewn.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BEANIEXXFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.578Z",
            updated_at: "2025-09-02T08:09:40.587Z",
            reference: "sku_16",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/prices",
                related: "https://mock.localhost/api/skus/nMPOSDblxk/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nMPOSDblxk/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/links",
                related: "https://mock.localhost/api/skus/nMPOSDblxk/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/events",
                related: "https://mock.localhost/api/skus/nMPOSDblxk/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/tags",
                related: "https://mock.localhost/api/skus/nMPOSDblxk/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/versions",
                related: "https://mock.localhost/api/skus/nMPOSDblxk/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nMPOSDblxk/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nMPOSDblxk/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "WVyPSYOxgb",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/WVyPSYOxgb",
          },
          attributes: {
            code: "BODYBSSS000000FFFFFF12MX",
            name: "Baby's Black Short Sleeve Bodysuit with White Logo (12 months)",
            description:
              "This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BODYBSSS000000FFFFFF12MX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.592Z",
            updated_at: "2025-05-07T13:27:51.102Z",
            reference: "sku_17",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/prices",
                related: "https://mock.localhost/api/skus/WVyPSYOxgb/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/WVyPSYOxgb/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/links",
                related: "https://mock.localhost/api/skus/WVyPSYOxgb/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/events",
                related: "https://mock.localhost/api/skus/WVyPSYOxgb/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/tags",
                related: "https://mock.localhost/api/skus/WVyPSYOxgb/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/versions",
                related: "https://mock.localhost/api/skus/WVyPSYOxgb/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/WVyPSYOxgb/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/WVyPSYOxgb/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "ZXxPSDpXdA",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZXxPSDpXdA",
          },
          attributes: {
            code: "BODYBSSS000000FFFFFF6MXX",
            name: "Baby's Black Short Sleeve Bodysuit with White Logo (6 months)",
            description:
              "This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BODYBSSS000000FFFFFF6MXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.608Z",
            updated_at: "2025-05-07T13:27:51.116Z",
            reference: "sku_18",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/prices",
                related: "https://mock.localhost/api/skus/ZXxPSDpXdA/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZXxPSDpXdA/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/links",
                related: "https://mock.localhost/api/skus/ZXxPSDpXdA/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/events",
                related: "https://mock.localhost/api/skus/ZXxPSDpXdA/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/tags",
                related: "https://mock.localhost/api/skus/ZXxPSDpXdA/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/versions",
                related: "https://mock.localhost/api/skus/ZXxPSDpXdA/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZXxPSDpXdA/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZXxPSDpXdA/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "BqkxSGJexJ",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/BqkxSGJexJ",
          },
          attributes: {
            code: "BODYBSSSFFFFFF00000012MX",
            name: "Baby's White Short Sleeve Bodysuit with Black Logo (12 months)",
            description:
              "This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BODYBSSSFFFFFF00000012MX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.622Z",
            updated_at: "2025-05-07T13:27:51.130Z",
            reference: "sku_19",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/prices",
                related: "https://mock.localhost/api/skus/BqkxSGJexJ/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/BqkxSGJexJ/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/links",
                related: "https://mock.localhost/api/skus/BqkxSGJexJ/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/events",
                related: "https://mock.localhost/api/skus/BqkxSGJexJ/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/tags",
                related: "https://mock.localhost/api/skus/BqkxSGJexJ/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/versions",
                related: "https://mock.localhost/api/skus/BqkxSGJexJ/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/BqkxSGJexJ/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/BqkxSGJexJ/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "WGDMSMAEYz",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/WGDMSMAEYz",
          },
          attributes: {
            code: "BODYBSSSFFFFFF0000006MXX",
            name: "Baby's White Short Sleeve Bodysuit with Black Logo (6 months)",
            description:
              "This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BODYBSSSFFFFFF0000006MXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.636Z",
            updated_at: "2025-05-07T13:27:51.146Z",
            reference: "sku_20",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/prices",
                related: "https://mock.localhost/api/skus/WGDMSMAEYz/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/WGDMSMAEYz/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/links",
                related: "https://mock.localhost/api/skus/WGDMSMAEYz/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/events",
                related: "https://mock.localhost/api/skus/WGDMSMAEYz/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/tags",
                related: "https://mock.localhost/api/skus/WGDMSMAEYz/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/versions",
                related: "https://mock.localhost/api/skus/WGDMSMAEYz/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/WGDMSMAEYz/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/WGDMSMAEYz/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "BwpOSrxOkE",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/BwpOSrxOkE",
          },
          attributes: {
            code: "BOTT17OZFFFFFF000000XXXX",
            name: "White Water Bottle with Black Logo (17oz)",
            description:
              "Beautifully designed water bottle, made from high-grade stainless steel. Its double-wall construction makes it perfect for storing both hot and cold liquids.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BOTT17OZFFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.650Z",
            updated_at: "2025-05-07T13:27:51.159Z",
            reference: "sku_21",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/prices",
                related: "https://mock.localhost/api/skus/BwpOSrxOkE/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/BwpOSrxOkE/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/links",
                related: "https://mock.localhost/api/skus/BwpOSrxOkE/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/events",
                related: "https://mock.localhost/api/skus/BwpOSrxOkE/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/tags",
                related: "https://mock.localhost/api/skus/BwpOSrxOkE/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/versions",
                related: "https://mock.localhost/api/skus/BwpOSrxOkE/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/BwpOSrxOkE/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/BwpOSrxOkE/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nOpOSljYLA",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nOpOSljYLA",
          },
          attributes: {
            code: "BTOW3060000000FFFFFFXXXX",
            name: "Black Beach Towel with White Logo (30x60)",
            description:
              "Lightweight beach towel to match your summer. 100% super soft & absorbent cotton velour. Reactive dye that helps prevent fading. One-sided print.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BTOW3060000000FFFFFFXXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.664Z",
            updated_at: "2025-05-07T13:27:51.171Z",
            reference: "sku_22",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/prices",
                related: "https://mock.localhost/api/skus/nOpOSljYLA/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nOpOSljYLA/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/links",
                related: "https://mock.localhost/api/skus/nOpOSljYLA/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/events",
                related: "https://mock.localhost/api/skus/nOpOSljYLA/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/tags",
                related: "https://mock.localhost/api/skus/nOpOSljYLA/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/versions",
                related: "https://mock.localhost/api/skus/nOpOSljYLA/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nOpOSljYLA/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nOpOSljYLA/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "nzPQSrjmak",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/nzPQSrjmak",
          },
          attributes: {
            code: "BTOW3060FFFFFF000000XXXX",
            name: "White Beach Towel with Black Logo (30x60)",
            description:
              "Lightweight beach towel to match your summer. 100% super soft & absorbent cotton velour. Reactive dye that helps prevent fading. One-sided print.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/BTOW3060FFFFFF000000XXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.679Z",
            updated_at: "2025-05-07T13:27:51.187Z",
            reference: "sku_23",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/prices",
                related: "https://mock.localhost/api/skus/nzPQSrjmak/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/nzPQSrjmak/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/links",
                related: "https://mock.localhost/api/skus/nzPQSrjmak/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/events",
                related: "https://mock.localhost/api/skus/nzPQSrjmak/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/tags",
                related: "https://mock.localhost/api/skus/nzPQSrjmak/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/versions",
                related: "https://mock.localhost/api/skus/nzPQSrjmak/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/nzPQSrjmak/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/nzPQSrjmak/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
        {
          id: "ZrxeSPvVYK",
          type: "skus",
          links: {
            self: "https://mock.localhost/api/skus/ZrxeSPvVYK",
          },
          attributes: {
            code: "CROPTOPW000000FFFFFFLXXX",
            name: "Women's Black Crop Top with White Logo (L)",
            description:
              "Body-hugging crop top that will become the centerpiece of any summer outfit! 82% polyester, 18% spandex. Made with a smooth and comfortable microfiber yarn.",
            image_url:
              "https://data.commercelayer.app/seeder/images/skus/CROPTOPW000000FFFFFFLXXX_FLAT.png",
            pieces_per_pack: null,
            weight: null,
            unit_of_weight: null,
            hs_tariff_number: null,
            do_not_ship: false,
            do_not_track: false,
            created_at: "2022-09-16T09:04:19.693Z",
            updated_at: "2025-05-07T13:27:51.199Z",
            reference: "sku_24",
            reference_origin: null,
            jwt_custom_claim: null,
            metadata: {},
          },
          relationships: {
            shipping_category: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/shipping_category",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/shipping_category",
              },
            },
            prices: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/prices",
                related: "https://mock.localhost/api/skus/ZrxeSPvVYK/prices",
              },
            },
            stock_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/stock_items",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/stock_items",
              },
            },
            stock_reservations: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/stock_reservations",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/stock_reservations",
              },
            },
            delivery_lead_times: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/delivery_lead_times",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/delivery_lead_times",
              },
            },
            sku_options: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/sku_options",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/sku_options",
              },
            },
            sku_list_items: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/sku_list_items",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/sku_list_items",
              },
            },
            sku_lists: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/sku_lists",
                related: "https://mock.localhost/api/skus/ZrxeSPvVYK/sku_lists",
              },
            },
            attachments: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/attachments",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/attachments",
              },
            },
            links: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/links",
                related: "https://mock.localhost/api/skus/ZrxeSPvVYK/links",
              },
            },
            events: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/events",
                related: "https://mock.localhost/api/skus/ZrxeSPvVYK/events",
              },
            },
            tags: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/tags",
                related: "https://mock.localhost/api/skus/ZrxeSPvVYK/tags",
              },
            },
            versions: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/versions",
                related: "https://mock.localhost/api/skus/ZrxeSPvVYK/versions",
              },
            },
            jwt_customer: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/jwt_customer",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/jwt_customer",
              },
            },
            jwt_markets: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/jwt_markets",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/jwt_markets",
              },
            },
            jwt_stock_locations: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/jwt_stock_locations",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/jwt_stock_locations",
              },
            },
            event_stores: {
              links: {
                self: "https://mock.localhost/api/skus/ZrxeSPvVYK/relationships/event_stores",
                related:
                  "https://mock.localhost/api/skus/ZrxeSPvVYK/event_stores",
              },
            },
          },
          meta: {
            mode: "test",
            organization_id: "eyoZOFvPpR",
            trace_id:
              "2e62120bc7f23c71da90041b638425ed7817fb94079bebe3bb1814ddc1cf7fe2",
          },
        },
      ],
      meta: { record_count: 252, page_count: 11 },
      links: {
        first:
          "https://mock.localhost/api/skus?page%5Bnumber%5D=1&page%5Bsize%5D=25&sort=code",
        next: "https://mock.localhost/api/skus?page%5Bnumber%5D=2&page%5Bsize%5D=25&sort=code",
        last: "https://mock.localhost/api/skus?page%5Bnumber%5D=11&page%5Bsize%5D=25&sort=code",
      },
    })
  },
)

export default [allSkus]

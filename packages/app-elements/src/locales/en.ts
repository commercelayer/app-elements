import {
  type ListableResourceType,
  type ResourceFields
} from '@commercelayer/sdk'
import { type Primitive } from 'type-fest'

const resources = {
  addresses: {
    name: 'Address',
    name_other: 'Addresses',
    attributes: {}
  },
  adjustments: {
    name: 'Adjustment',
    name_other: 'Adjustments',
    attributes: {}
  },
  bundles: {
    name: 'Bundle',
    name_other: 'Bundles',
    attributes: {
      currency_code: 'Currency code'
    }
  },
  coupons: {
    name: 'Coupon',
    name_other: 'Coupons',
    attributes: {}
  },
  customers: {
    name: 'Customer',
    name_other: 'Customers',
    attributes: {
      status: {
        prospect: 'Prospect',
        acquired: 'Acquired',
        repeat: 'Repeat'
      }
    }
  },
  orders: {
    name: 'Order',
    name_other: 'Orders',
    attributes: {
      status: {
        approved: 'Approved',
        cancelled: 'Cancelled',
        draft: 'Draft',
        editing: 'Editing',
        pending: 'Pending',
        placed: 'Placed',
        placing: 'Placing'
      },
      payment_status: {
        authorized: 'Authorized',
        paid: 'Paid',
        unpaid: 'Unpaid',
        free: 'Free',
        voided: 'Voided',
        refunded: 'Refunded',
        partially_authorized: 'Part. authorized',
        partially_paid: 'Part. paid',
        partially_refunded: 'Part. refunded',
        partially_voided: 'Part. voided'
      },
      fulfillment_status: {
        unfulfilled: 'Unfulfilled',
        in_progress: 'In progress',
        fulfilled: 'Fulfilled',
        not_required: 'Not required'
      },
      billing_address: 'Billing address',
      shipping_address: 'Shipping address'
    }
  },
  gift_cards: {
    name: 'Gift card',
    name_other: 'Gift cards',
    attributes: {}
  },
  markets: {
    name: 'Market',
    name_other: 'Markets',
    attributes: {}
  },
  promotions: {
    name: 'Promotion',
    name_other: 'Promotions',
    attributes: {
      status: {
        active: 'Active',
        disabled: 'Disabled',
        expired: 'Expired',
        inactive: 'Inactive',
        pending: 'Pending'
      }
    }
  },
  returns: {
    name: 'Return',
    name_other: 'Returns',
    attributes: {
      status: {
        approved: 'Approved',
        cancelled: 'Cancelled',
        draft: 'Draft',
        requested: 'Requested',
        received: 'Received',
        rejected: 'Rejected',
        refunded: 'Refunded',
        shipped: 'Shipped'
      }
    }
  },
  shipments: {
    name: 'Shipment',
    name_other: 'Shipments',
    attributes: {
      status: {
        cancelled: 'Cancelled',
        delivered: 'Delivered',
        draft: 'Draft',
        on_hold: 'On hold',
        packing: 'Packing',
        picking: 'Picking',
        ready_to_ship: 'Ready to ship',
        shipped: 'Shipped',
        upcoming: 'Upcoming'
      }
    }
  },
  shipping_methods: {
    name: 'Shipping method',
    name_other: 'Shipping methods',
    attributes: {}
  },
  skus: {
    name: 'SKU',
    name_other: 'SKUs',
    attributes: {}
  },
  stock_transfers: {
    name: 'Stock transfer',
    name_other: 'Stock transfers',
    attributes: {
      status: {
        cancelled: 'Cancelled',
        completed: 'Completed',
        draft: 'Draft',
        in_transit: 'In transit',
        on_hold: 'On hold',
        picking: 'Picking',
        upcoming: 'Upcoming'
      }
    }
  },
  tags: {
    name: 'Tag',
    name_other: 'Tags',
    attributes: {}
  }
} satisfies {
  [key in ListableResourceType]?: {
    name: string
    name_other: string
    attributes: {
      [attr in keyof ResourceFields[key]]?: true extends IsStringLiteral<
        ResourceFields[key][attr]
      >
        ? // @ts-expect-error TODO: check if this is fixable
          { [K in NonNullable<ResourceFields[key][attr]>]?: string }
        : string
    }
  }
}

type IsStringLiteral<T> =
  'I am a literal type' extends NonNullable<T>
    ? false // Handle `string` specifically
    : NonNullable<T> extends Exclude<Primitive, string>
      ? false // Handle `Primitive` specifically
      : true // It's a string literal

const en = {
  common: {
    add_resource: 'Add {{resource}}',
    add_up_to: 'You can add up to {{limit}} {{resource}}.',
    all_items: 'All items',
    amount: 'Amount',
    apply: 'Apply',
    back: 'Back',
    cancel: 'Cancel',
    clear_text: 'Clear text',
    close: 'Close',
    continue: 'Continue',
    create_resource: 'Create {{resource}}',
    download_file: 'Download file',
    download_json: 'Download JSON',
    edit: 'Edit',
    edit_resource: 'Edit {{resource}}',
    filters: 'Filters',
    limit_reached: 'Limit reached',
    manage_resource: 'Manage {{resource}}',
    metadata: 'Metadata',
    new: 'New',
    no_items: 'No items',
    not_authorized: 'Not authorized',

    not_handled: 'Not handled',
    search: 'Search...',
    select_resource: 'Select {{resource}}',

    update: 'Update',
    updated: 'Updated',
    view_logs: 'View logs',
    view_api_docs: 'View API reference',
    empty_states: {
      not_found: 'Not found',
      generic_not_found: 'We could not find the resource you are looking for.',
      no_resource_found: 'No {{resource}} found!',
      no_resource_yet: 'No {{resource}} yet!',
      create_the_first_resource:
        'Add a new {{resource}} with the API, or use the CLI.',
      no_resource_found_for_organization:
        'No {{resource}} found for this organization.',
      no_resource_found_for_filters:
        "We didn't find any {{resources}} matching the current filters selection."
    },
    generic_select_autocomplete_hint: 'Type to search for more options.',
    routes: {
      missing_configuration:
        'Missing configuration when defining {{component}}',
      loading_app_page: 'Loading app page...',
      page_not_found: 'Page not found',
      invalid_resource: 'Invalid {{resource}}',
      we_could_not_find_page: 'We could not find the page you are looking for.',
      we_could_not_find_resource:
        'We could not find the {{resource}} you are looking for.',
      go_home: 'Go home'
    },
    table: {
      and_another_record: 'and another record',
      and_other_records: 'and {{count}} other records',
      record: '1 record',
      record_other: '{{count}} records'
    },
    timeline: {
      name: 'Timeline',
      leave_a_note: 'Leave a note or comment',
      only_staff_can_see: 'Only you and other staff can see comments'
    }
  },
  resources,
  apps: {
    orders: {
      attributes: {
        status: 'Status',
        payment_status: 'Payment status',
        fulfillment_status: 'Fulfillment status'
      },
      display_status: {
        in_progress: 'In progress',
        in_progress_manual: 'In progress (Manual)'
      },
      task: {
        open: 'Open',
        browse: 'Browse',
        awaiting_approval: 'Awaiting approval',
        error_to_cancel: 'Error to cancel',
        payment_to_capture: 'Payment to capture',
        fulfillment_in_progress: 'Fulfillment in progress',
        editing: 'Editing',
        history: 'Order history',
        cart: 'Cart',
        carts: 'Carts',
        archived: 'Archived'
      },
      details: {
        summary: 'Summary',
        to_be_calculated: 'To be calculated',
        shipping: 'Shipping',
        subtotal: 'Subtotal',
        total: 'Total',
        payment_method: 'Payment method',
        taxes: 'Taxes',
        included: 'included',
        discount: 'Discount',
        fulfillment: 'Fulfillment',
        payment: 'Payment',
        use_for_shipping: 'Use for shipping',
        use_for_billing: 'Use for billing',
        new_total_line1:
          'The new total is {{new_total}}, {{difference}} more than the original total.',
        new_total_line2: 'Adjust the total to make it equal or less.'
      },
      form: {
        language: 'Language',
        language_hint: 'The language used for checkout',
        error_create_order:
          'Cannot create the order without a valid item. Please select one.',
        email: 'Email',
        email_placeholder: 'Search or add email',
        email_hint: "The customer's email for this order.",
        coupon_code: 'Coupon code',
        select_adjustment_amount:
          'Select a positive amount type to increase the order total.',
        manual_adjustment_name: 'Manual adjustment'
      },
      actions: {
        add_item: 'Add item',
        approve: 'Approve',
        archive: 'Archive',
        cancel_transactions: 'Cancel payment',
        cancel: 'Cancel order',
        capture: 'Capture payment',
        place: 'Place order',
        refund: 'Refund',
        unarchive: 'Unarchive',
        continue_editing: 'Continue editing',
        finish_editing: 'Finish',
        adjust_total: 'Adjust total'
      }
    },
    shipments: {
      details: {
        awaiting_stock_transfer: 'Awaiting stock transfer'
      }
    },
    promotions: {
      display_status: {
        upcoming: 'Upcoming'
      }
    }
  },
  validation: {
    select_one_item: 'Please select at least one item',
    coupon_code_invalid: 'Please enter a valid coupon code.',
    coupon_code_too_short: 'Coupon code is too short (minimum is 8 characters)',
    amount_invalid: 'Please enter a valid amount',
    required_field: 'Required field'
  }
}

export default en

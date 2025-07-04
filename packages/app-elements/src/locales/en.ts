import {
  type ListableResourceType,
  type ResourceFields
} from '@commercelayer/sdk'
import { type Primitive } from 'type-fest'

const resources = {
  addresses: {
    name: 'Address',
    name_other: 'Addresses',
    attributes: {
      billing_info: 'Billing info',
      city: 'City',
      company: 'Company',
      country_code: 'Country',
      first_name: 'First name',
      last_name: 'Last name',
      line_1: 'Address',
      notes: 'Notes',
      phone: 'Phone',
      state_code: 'State',
      zip_code: 'ZIP code'
    }
  },
  adjustments: {
    name: 'Adjustment',
    name_other: 'Adjustments',
    attributes: {}
  },
  attachments: {
    name: 'Attachment',
    name_other: 'Attachments',
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
      email: 'Email',
      status: {
        prospect: 'Prospect',
        acquired: 'Acquired',
        repeat: 'Repeat'
      }
    }
  },
  links: {
    name: 'Link',
    name_other: 'Links',
    attributes: {}
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
  packages: {
    name: 'Package',
    name_other: 'Packages',
    attributes: {}
  },
  parcels: {
    name: 'Parcel',
    name_other: 'Parcels',
    attributes: {
      unit_of_weight: {
        gr: 'grams',
        lb: 'pound',
        oz: 'once'
      }
    }
  },
  promotions: {
    name: 'Promotion',
    name_other: 'Promotions',
    attributes: {
      priority: 'Priority',
      exclusive: 'Exclusive',
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
  stock_locations: {
    name: 'Stock location',
    name_other: 'Stock locations',
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
    add_another: 'Add another',
    add_resource: 'Add {{resource}}',
    new_resource: 'New {{resource}}',
    missing_resource: 'Missing {{resource}}',
    update_resource: 'Update {{resource}}',
    add_up_to: 'You can add up to {{limit}} {{resource}}.',
    all: 'All',
    all_items: 'All items',
    amount: 'Amount',
    apply: 'Apply',
    apply_filters: 'Apply filters',
    attachments: 'Attachments',
    back: 'Back',
    go_back: 'Go back',
    cancel: 'Cancel',
    clear_text: 'Clear text',
    close: 'Close',
    continue: 'Continue',
    could_not_retrieve_data: 'Could not retrieve data',
    could_not_retrieve_resource: 'Could not retrieve {{resource}}',
    create: 'Create',
    create_resource: 'Create {{resource}}',
    created: 'Created',
    currency: 'Currency',
    custom_time_range: 'Custom Time Range',
    delete_resource: 'Delete {{resource}}',
    delete: 'Delete',
    download_file: 'Download file',
    download_json: 'Download JSON',
    edit: 'Edit',
    edit_details: 'Edit details',
    edit_resource: 'Edit {{resource}}',
    estimated_delivery: 'Estimated delivery',
    filters: 'Filters',
    from: 'From',
    to: 'To',
    today: 'Today',
    last_7_days: 'Last 7 days',
    last_30_days: 'Last 30 days',
    custom: 'Custom',
    info: 'Info',
    limit_reached: 'Limit reached',
    loading: 'Loading...',
    manage_resource: 'Manage {{resource}}',
    metadata: 'Metadata',
    new: 'New',
    no_address: 'No address',
    no_items: 'No items',
    no_metadata: 'No metadata',
    no_results_found: 'No results found',
    no_textsearch_filter_set: 'No textSearch filter set',
    not_authorized: 'Not authorized',
    not_authorized_description: 'You are not authorized to access this page.',
    not_handled: 'Not handled',
    parcel_total: 'Total',
    parcel_weight: 'Weight',
    print_shipping_label: 'Print shipping label',
    reference: 'Reference',
    reference_origin: 'Reference origin',
    retry: 'Retry',
    remove: 'Remove',
    restocked: 'Restocked',
    search: 'Search...',
    see_all: 'See all',
    select: 'Select...',
    select_resource: 'Select {{resource}}',
    show_less: 'Show less',
    show_more: 'Show more',
    card_expires: 'expires',
    saving: 'Saving...',
    status: 'Status',
    swap: 'Swap',
    taxes: 'Taxes',
    time_range: 'Time Range',
    tracking: 'Tracking',
    try_to_refresh_page: 'Try to refresh the page or ask for support.',
    unit_price: 'Unit price',
    update: 'Update',
    updated: 'Updated',
    view_logs: 'View logs',
    view_api_docs: 'View API reference',
    empty_states: {
      not_found: 'Not found',
      generic_not_found: 'We could not find the resource you are looking for.',
      all_good_here: 'All good here!',
      no_resource_found: 'No {{resource}} found!',
      no_resource_yet: 'No {{resource}} yet!',
      create_the_first_resource:
        'Add a new {{resource}} with the API, or use the CLI.',
      no_resources_found_for_list:
        'There are no {{resources}} for the current list.',
      no_resource_found_for_organization:
        'No {{resource}} found for this organization.',
      no_resources_found_for_filters:
        "We didn't find any {{resources}} matching the current filters selection."
    },
    generic_select_autocomplete_hint: 'Type to search for more options.',
    forms: {
      currency_code_not_valid: '{{currencyCode}} is not a valid currency code.',
      cents_not_integer: '`cents` ({{cents}}) is not an integer value',
      type_to_search_for_more:
        'Showing 25 results. Type to search for more options.',
      all_markets_with_currency: 'All markets with currency',
      minimum: 'Minimum',
      maximum: 'Maximum',
      drag_here_or: 'drag and drop it here or',
      browse_files: 'browse files',
      required_field: 'Required field'
    },
    routes: {
      page_not_found: 'Page not found',
      invalid_resource: 'Invalid {{resource}}',
      invalid_resource_or_not_authorized:
        '{{resource}} is invalid or you are not authorized to access this page.',
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
      only_staff_can_see: 'Only you and other staff can see comments',
      resource_created: '{{resource}} created',
      resource_updated: '{{resource}} updated',
      order_placed: 'Order #{{number}} placed in {{orderMarket}}',
      left_a_note: 'left a note',
      left_a_refund_note: 'left a refund note',
      resources: {
        order_is: 'Order is',
        order_was: 'Order was',
        order_created: 'created',
        order_placed: 'placed',
        order_cancelled: 'cancelled',
        order_archived: 'archived',
        order_approved: 'approved',
        order_fulfilled: 'fulfilled',
        order_unfulfilled: 'unfulfilled',
        order_fulfillment_is: 'Order fulfillment is',
        order_fulfillment_in_progress: 'in progress',
        order_fulfillment_not_required: 'not required',
        payment_of_was: 'Payment of {{amount}} was',
        return_number_was: 'Return #{{number}} was',
        return_approved: 'approved',
        return_cancelled: 'cancelled',
        return_received: 'received',
        return_rejected: 'rejected',
        return_shipped: 'shipped',
        stock_transfer_completed: 'completed',
        shipment_number_is: 'Shipment #{{number}} is',
        shipment_number_isbeing: 'Shipment #{{number}} is being',
        shipment_number_was: 'Shipment #{{number}} was',
        shipment_on_hold: 'on hold',
        shipment_picked: 'picked',
        shipment_packed: 'packed',
        shipment_ready_to_ship: 'ready for shipping',
        shipment_shipped: 'shipped',
        transaction_of: '{{transaction}} of {{amount}}',
        transaction_failed: 'failed'
      }
    },
    links: {
      checkout_link_status: 'Checkout link is {{status}}!',
      open_checkout: 'Open checkout',
      share_email_subject: 'Checkout your order (#{{number}})',
      share_email_body:
        'Dear customer,\nplease follow this link to checkout your order #{{number}: \n{{url}}\nThank you,\nThe {{organization}} team',
      share_whatsapp_text:
        'Please follow this link to checkout your order *#{{number}}*: {{url}}'
    },
    tracking_details: {
      contents_type: 'Contents type',
      courier: 'Courier',
      customs_signer: 'Customs signer',
      customs_certify: 'Customs certify',
      estimated_delivery_date: 'Estimated Delivery Date',
      delivery_confirmation: 'Delivery confirmation',
      last_update: 'Last update',
      non_delivery_option: 'Non delivery option',
      restriction_type: 'Restriction type',
      tracking_pre_transit: 'Pre-Transit',
      tracking_in_transit: 'In Transit',
      tracking_out_for_delivery: 'Out for Delivery',
      tracking_delivered: 'Delivered'
    },
    no_resources: {
      no_tags: 'No tags'
    }
  },
  resources,
  apps: {
    customers: {
      attributes: {
        status: 'Status'
      },
      details: {
        registered: 'Registered',
        guest: 'Guest',
        newsletter: 'Newsletter',
        subscribed: 'Subscribed',
        type: 'Type',
        wallet: 'Wallet',
        groups: 'Groups',
        confirm_customer_delete: 'Confirm that you want to delete {{email}}'
      },
      anonymize: {
        title: 'Customer cannot be deleted',
        description:
          'The customer cannot be deleted. Instead, you can request the anonymization. Their personal data will be replaced in all the related resources, including orders. You can cancel the anonymization request until it is not in progress.',
        request_button: 'Request anonymization'
      },
      anonymization_info: {
        alert_requested:
          'Customer anonymization requested by {{requestedby}} on {{requestedat}}. You can cancel this request until it is processed.',
        alert_in_progress:
          'Customer anonymization in progress. Requested by {{requestedby}} on {{requestedat}}.',
        alert_completed:
          'Customer anonymization completed on {{completedat}}. Requested by {{requestedby}} on {{requestedat}}.',
        cancel_button: 'Cancel request'
      },
      form: {
        customer_group_label: 'Group',
        customer_group_hint: 'The group to which this customer belongs',
        email_hint: "The customer's email address"
      }
    },
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
      tasks: {
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
        archived: 'Archived',
        request_return: 'Request return'
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
        new_total_line2: 'Adjust the total to make it equal or less.',
        confirm_order_cancellation:
          'Confirm that you want to cancel order #{{number}}',
        confirm_capture: 'Confirm capture',
        irreversible_action:
          'This action cannot be undone, proceed with caution.',
        payment_captured: 'Captured',
        payment_authorization: 'Payment authorization',
        payment_capture: 'Payment capture',
        payment_refund: 'Refund',
        payment_void: 'Void',
        waiting_for_successful_capture: 'Waiting for successful capture'
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
        capture_payment: 'Capture payment',
        capture: 'Capture',
        place: 'Place order',
        refund: 'Refund',
        unarchive: 'Unarchive',
        continue_editing: 'Continue editing',
        finish_editing: 'Finish',
        adjust_total: 'Adjust total'
      }
    },
    returns: {
      attributes: {
        status: 'Status'
      },
      details: {
        origin: 'Origin',
        destination: 'Destination',
        to_destination: 'To',
        return_locations: 'Return locations',
        confirm_return_cancellation:
          'Confirm that you want to cancel return #{{number}}',
        delete_error: 'Could not cancel this return',
        info: 'Info',
        timeline_requested_return:
          '{{email}} requested the return of {{count}} item',
        timeline_requested_return_other:
          '{{email}} requested the return of {{count}} items',
        timeline_shipped: 'Return was <strong>shipped</strong>',
        timeline_received: 'Return was <strong>received</strong>',
        timeline_cancelled: 'Return was <strong>cancelled</strong>',
        timeline_archived: 'Return was <strong>archived</strong>',
        timeline_approved: 'Return was <strong>approved</strong>',
        timeline_item_code_restocked:
          'Item {{code}} was <strong>restocked</strong>',
        timeline_payment_of_amount_was_action:
          'Payment of {{amount}} was <strong>{{action}}</strong>',
        timeline_action_of_amount_failed:
          '{{action}} of {{amount}} <strong>failed</strong>'
      },
      tasks: {
        open: 'Open',
        browse: 'Browse',
        requested: 'Requested',
        approved: 'Approved',
        shipped: 'Shipped',
        all_returns: 'All returns',
        archived: 'Archived'
      },
      form: {
        items: 'Items',
        no_items: 'No items'
      },
      actions: {
        approve: 'Approve',
        reject: 'Reject',
        cancel: 'Cancel return',
        ship: 'Mark shipped',
        receive: 'Receive',
        restock: 'Restock',
        archive: 'Archive',
        unarchive: 'Unarchive',
        refund: 'Issue a refund'
      }
    },
    shipments: {
      attributes: {
        status: 'Status'
      },
      details: {
        awaiting_stock_transfer: 'Awaiting stock transfer',
        label_already_purchased: 'Shipping label already purchased',
        get_rates_error: 'Unable to get rates',
        purchase_label_error:
          'Could not purchase shipping label, please contact your carrier.',
        select_rate: 'Select a shipping rate',
        getting_rates: 'Getting rates...',
        purchasing: 'Purchasing...',
        not_in_packing: 'This shipment is not in packing status',
        picking_list: 'Picking list',
        awaiting_stock_transfers: 'Awaiting stock transfers',
        ship_from: 'Ship from',
        ship_to: 'Ship to',
        origin: 'Origin',
        weight: 'Weight',
        parcel_item: '{{count}} item',
        parcel_item_other: '{{count}} items'
      },
      tasks: {
        pending: 'Pending',
        browse: 'Browse',
        picking: 'Picking',
        packing: 'Packing',
        ready_to_ship: 'Ready to ship',
        on_hold: 'On hold',
        all_shipments: 'All shipments'
      },
      actions: {
        put_on_hold: 'Put on hold',
        start_picking: 'Start picking',
        start_packing: 'Start packing',
        continue_packing: 'Continue',
        set_back_to_picking: 'Back to picking',
        set_back_to_packing: 'Back to packing',
        set_ready_to_ship: 'Ready to ship',
        set_shipped: 'Mark as shipped',
        set_delivered: 'Mark as delivered',
        purchase_label: 'Purchase label',
        purchase_labels: 'Purchase labels'
      },
      form: {
        unit_of_weight: 'Unit of weight',
        required_package: 'Please select a package',
        invalid_weight: 'Please enter a weight',
        invalid_unit_of_weight: 'Please select a unit of weight',
        incoterms_rules: 'Incoterms rules',
        select_option: 'Select an option',
        delivery_confirmation: 'Delivery confirmations',
        require_custom_forms: 'Require custom forms',
        customs_info_type: 'The type of item you are sending',
        content_explanation_hint: 'Insert a brief description',
        customs_info_failed_delivery_label:
          'In case the shipment cannot be delivered',
        customs_info_restriction_type_label: 'Requires any special treatment',
        customs_info_customs_signer_label: 'Customs signer',
        customs_info_confirm_checkbox_label:
          'I confirm the provided information is accurate',
        required_custom_form_value:
          'Required when specifying a customs form value',
        required_if_other_is_selected: 'Please specify if "other" is selected',
        required_restriction_comments:
          "Please add a comment or select 'none' as restriction type",
        customs_info_customs_signer_signature: 'Signature',
        customs_info_customs_signer_no_signature: 'No signature',
        customs_info_type_merchandise: 'Merchandise',
        customs_info_type_gift: 'Gift',
        customs_info_type_documents: 'Documents',
        customs_info_type_returned_goods: 'Returned goods',
        customs_info_type_sample: 'Sample',
        customs_info_type_other: 'Other',
        customs_info_failed_delivery_return: 'Return',
        customs_info_failed_delivery_abandon: 'Abandon',
        customs_info_restriction_type_none: 'None',
        customs_info_restriction_type_other: 'Other',
        customs_info_restriction_type_quarantine: 'Quarantine',
        customs_info_restriction_type_sanitary_phytosanitary_inspection:
          'Sanitary or Phytosanitary inspection',
        no_packages_found: 'No packages found for current stock location',
        select_package: 'Select a package',
        packing_items: 'items',
        pack_items: 'Pack · {{items}}',
        more_options: 'More options'
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
    coupon_code_too_short:
      'Coupon code is too short (minimum is {{min}} characters)',
    amount_invalid: 'Please enter a valid amount',
    required_field: 'Required field'
  }
}

export default en

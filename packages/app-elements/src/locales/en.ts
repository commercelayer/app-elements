export const en = {
  common: {
    all: 'All {{resource}}',
    all_female: 'All {{resource}}',
    not_handled: 'Not handled',
    back: 'Back',
    new: 'New',
    new_resource: 'New {{resource}}',
    new_resource_female: 'New {{resource}}',
    not_authorized: 'Not authorized',
    no_items: 'No items',
    edit: 'Edit',
    manage: 'Manage {{resource}}',
    updated: 'Updated',
    timeline: 'Timeline',
    filters: 'Filters',
    metadata: 'Metadata',
    search: 'Search...',
    limit_reached: 'Limit reached',
    add_up_to: 'You can add up to {{limit}} {{resource}}.',
    update: 'Update',
    resources: {
      common: {
        status: {
          not_handled: 'Not handled'
        }
      },
      adjustments: {
        name: 'Adjustment',
        name_other: 'Adjustments',
        task: {
          adjust_total: 'Adjust total'
        }
      },
      bundles: {
        name: 'Bundle',
        name_other: 'Bundles',
        status: {}
      },
      customers: {
        name: 'Customer',
        name_other: 'Customers',
        status: {
          prospect: 'Prospect',
          acquired: 'Acquired',
          repeat: 'Repeat'
        }
      },
      orders: {
        name: 'Order',
        name_other: 'Orders',
        status: {
          name: 'Status',
          approved: 'Approved',
          cancelled: 'Cancelled',
          draft: 'Draft',
          editing: 'Editing',
          pending: 'Pending',
          placed: 'Placed',
          placing: 'Placing',
          in_progress: 'In progress',
          in_progress_manual: 'In progress (Manual)'
        },
        payment_status: {
          name: 'Payment status',
          name_short: 'Payment',
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
          name: 'Fulfillment status',
          name_short: 'Fulfillment',
          unfulfilled: 'Unfulfilled',
          in_progress: 'In progress',
          fulfilled: 'Fulfilled',
          not_required: 'Not required'
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
          billing_address: 'Billing address',
          shipping_address: 'Shipping address'
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
          select_address: 'Select address'
        }
      },
      gift_cards: {
        name: 'Gift card',
        name_other: 'Gift cards'
      },
      promotions: {
        name: 'Promotion',
        name_other: 'Promotions',
        status: {
          active: 'Active',
          disabled: 'Disabled',
          expired: 'Expired',
          inactive: 'Inactive',
          pending: 'Pending',
          upcoming: 'Upcoming'
        }
      },
      returns: {
        name: 'Return',
        name_other: 'Returns',
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
      },
      shipments: {
        name: 'Shipment',
        name_other: 'Shipments',
        status: {
          awaiting_stock_transfer: 'Awaiting stock transfer',
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
      },
      stock_transfers: {
        name: 'Stock transfer',
        name_other: 'Stock transfers',
        status: {
          cancelled: 'Cancelled',
          completed: 'Completed',
          draft: 'Draft',
          in_transit: 'In transit',
          on_hold: 'On hold',
          picking: 'Picking',
          upcoming: 'Upcoming'
        }
      },
      tags: {
        name: 'Tag',
        name_other: 'Tags',
        status: {}
      }
    },
    validation: {
      select_one_item: 'Please select at least one item'
    }
  }
}

export default en

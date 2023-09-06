import { type FiltersInstructions } from './types'

export const instructions: FiltersInstructions = [
  {
    label: 'Markets',
    type: 'options',
    sdk: {
      predicate: 'market_id_in'
    },
    render: {
      component: 'inputResourceGroup',
      props: {
        fieldForLabel: 'name',
        fieldForValue: 'id',
        resource: 'markets',
        searchBy: 'name_cont',
        sortBy: { attribute: 'name', direction: 'asc' },
        previewLimit: 5
      }
    }
  },
  {
    label: 'Order status',
    type: 'options',
    sdk: {
      predicate: 'status_in',
      defaultOptions: ['placed', 'approved', 'cancelled']
    },
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'multi',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'placed', label: 'Places' },
          { value: 'approved', label: 'Approved' },
          { value: 'cancelled', label: 'Cancelled' }
        ]
      }
    }
  },
  {
    label: 'Payment Status',
    type: 'options',
    sdk: {
      predicate: 'payment_status_in'
    },
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'multi',
        options: [
          { value: 'authorized', label: 'Authorized' },
          { value: 'paid', label: 'Paid' },
          { value: 'voided', label: 'Voided' },
          { value: 'refunded', label: 'Refunded' },
          { value: 'free', label: 'Free' },
          { value: 'unpaid', label: 'Unpaid' }
        ]
      }
    }
  },
  {
    label: 'Fulfillment Status',
    type: 'options',
    sdk: {
      predicate: 'fulfillment_status_in'
    },
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'multi',
        options: [
          { value: 'unfulfilled', label: 'Unfulfilled' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'fulfilled', label: 'Fulfilled' },
          { value: 'not_required', label: 'Not Required' }
        ]
      }
    }
  },
  {
    label: 'Archived',
    type: 'options',
    sdk: {
      predicate: 'archived_at_null',
      parseFormValue: (value) =>
        value === 'show' ? undefined : value !== 'only'
    },
    hidden: true,
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'single',
        options: [
          { value: 'only', label: 'Only archived' },
          { value: 'hide', label: 'Hide archived' },
          { value: 'show', label: 'Show all, both archived and not' }
        ]
      }
    }
  },
  {
    label: 'Time Range',
    type: 'timeRange',
    sdk: {
      predicate: 'updated_at'
    },
    render: {
      component: 'dateRangePicker'
    }
  },
  {
    label: 'Search',
    type: 'textSearch',
    sdk: {
      predicate: 'number_or_email_cont'
    },
    render: {
      component: 'searchBar'
    }
  },
  {
    label: 'Amount',
    type: 'currencyRange',
    sdk: {
      predicate: 'total_amount_cents'
    },
    render: {
      component: 'inputCurrencyRange',
      props: {
        label: 'Amount'
      }
    }
  }
]

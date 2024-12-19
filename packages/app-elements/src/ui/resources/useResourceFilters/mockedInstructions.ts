import { t } from '#providers/I18NProvider'
import { type FiltersInstructions } from './types'

export const instructions: FiltersInstructions = [
  {
    label: t('resources.markets.name_other'),
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
    label: t('common.filters_instructions.order_status'),
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
          {
            value: 'pending',
            label: t('resources.orders.attributes.status.pending')
          },
          {
            value: 'placed',
            label: t('resources.orders.attributes.status.placed')
          },
          {
            value: 'approved',
            label: t('resources.orders.attributes.status.approved')
          },
          {
            value: 'cancelled',
            label: t('resources.orders.attributes.status.cancelled')
          }
        ]
      }
    }
  },
  {
    label: t('common.filters_instructions.payment_status'),
    type: 'options',
    sdk: {
      predicate: 'payment_status_eq'
    },
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'single',
        options: [
          {
            value: 'authorized',
            label: t('resources.orders.attributes.payment_status.authorized')
          },
          {
            value: 'paid',
            label: t('resources.orders.attributes.payment_status.paid')
          },
          {
            value: 'voided',
            label: t('resources.orders.attributes.payment_status.voided')
          },
          {
            value: 'refunded',
            label: t('resources.orders.attributes.payment_status.refunded')
          },
          {
            value: 'free',
            label: t('resources.orders.attributes.payment_status.free')
          },
          {
            value: 'unpaid',
            label: t('resources.orders.attributes.payment_status.unpaid')
          }
        ]
      }
    }
  },
  {
    label: t('common.filters_instructions.fulfillment_status'),
    type: 'options',
    sdk: {
      predicate: 'fulfillment_status_in'
    },
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'multi',
        options: [
          {
            value: 'unfulfilled',
            label: t(
              'resources.orders.attributes.fulfillment_status.unfulfilled'
            )
          },
          {
            value: 'in_progress',
            label: t(
              'resources.orders.attributes.fulfillment_status.in_progress'
            )
          },
          {
            value: 'fulfilled',
            label: t('resources.orders.attributes.fulfillment_status.fulfilled')
          },
          {
            value: 'not_required',
            label: t(
              'resources.orders.attributes.fulfillment_status.not_required'
            )
          }
        ]
      }
    }
  },
  {
    label: t('common.filters_instructions.archived'),
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
          {
            value: 'only',
            label: t('common.filters_instructions.only_archived')
          },
          {
            value: 'hide',
            label: t('common.filters_instructions.hide_archived')
          },
          { value: 'show', label: t('common.filters_instructions.show_all') }
        ]
      }
    }
  },
  {
    label: t('common.filters_instructions.time_range'),
    type: 'timeRange',
    sdk: {
      predicate: 'updated_at'
    },
    render: {
      component: 'dateRangePicker'
    }
  },
  {
    label: t('common.filters_instructions.search'),
    type: 'textSearch',
    sdk: {
      predicate: 'number_or_email_cont'
    },
    render: {
      component: 'searchBar'
    }
  },
  {
    label: t('common.filters_instructions.name'),
    type: 'textSearch',
    sdk: {
      predicate: 'name_eq'
    },
    render: {
      component: 'input'
    }
  },
  {
    label: t('common.filters_instructions.amount'),
    type: 'currencyRange',
    sdk: {
      predicate: 'total_amount_cents'
    },
    render: {
      component: 'inputCurrencyRange',
      props: {
        label: t('common.filters_instructions.amount')
      }
    }
  }
]

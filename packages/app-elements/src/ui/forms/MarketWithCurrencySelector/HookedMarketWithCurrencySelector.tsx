import { currencyInputSelectOptions } from '#helpers/currencies'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { t } from '#providers/I18NProvider'
import {
  flatSelectValues,
  HookedInputSelect,
  type InputSelectProps,
  type InputSelectValue
} from '#ui/forms/InputSelect'
import {
  type ListResponse,
  type Market,
  type Resource
} from '@commercelayer/sdk'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import type { FC } from 'react'
import { useFormContext } from 'react-hook-form'

export interface HookedMarketWithCurrencySelectorProps
  extends Pick<InputSelectProps, 'hint' | 'label' | 'isDisabled'> {
  /**
   * Market input name where market ID is stored.
   * Must match the field name in your form state/schema.
   */
  fieldNameMarket: string
  /**
   * Currency input name where currency code is stored.
   * Must match the field name in your form state/schema
   */
  fieldNameCurrencyCode: string
}

/**
 * Render a select input to choose a market as relationship with an empty option to choose "All markets with currency".
 * If this option is selected, a currency select input will be shown.
 */
export const HookedMarketWithCurrencySelector: FC<
  HookedMarketWithCurrencySelectorProps
> = ({
  fieldNameMarket,
  fieldNameCurrencyCode,
  label = 'Market *',
  hint,
  isDisabled
}) => {
  const { sdkClient } = useCoreSdkProvider()
  const {
    watch,
    setValue,
    formState: { defaultValues }
  } = useFormContext()
  const defaultMarketId = defaultValues?.[fieldNameMarket]
  const defaultCurrencyCode = defaultValues?.[fieldNameCurrencyCode]

  const { data, isLoading: isLoadingInitialValues } = useCoreApi(
    'markets',
    'list',
    [
      {
        fields: {
          markets: ['name', 'price_list'],
          price_lists: ['currency_code']
        },
        include: ['price_list'],
        pageSize: 25,
        filters: isEmpty(defaultMarketId)
          ? undefined
          : {
              id_not_eq: defaultMarketId
            },
        sort: {
          name: 'asc'
        }
      }
    ]
  )

  const hasMorePages =
    (data?.meta?.pageCount != null && data.meta.pageCount > 1) ?? false

  const { data: defaultResource, isLoading: isLoadingDefaultResource } =
    useCoreApi(
      'markets',
      'retrieve',
      isEmpty(defaultMarketId)
        ? null
        : [
            defaultMarketId,
            {
              fields: {
                markets: ['name', 'price_list'],
                price_lists: ['currency_code']
              },
              include: ['price_list']
            }
          ]
    )

  const initialValues = [
    {
      label: t('common.forms.all_markets_with_currency'),
      value: ''
    },
    ...makeSelectInitialValuesWithDefault<Market>({
      resourceList: data,
      defaultResource,
      fieldForLabel: 'name'
    })
  ]

  const selectedMarket = watch(fieldNameMarket)

  return (
    <div
      className={cn('grid gap-4 ', {
        'grid-cols-[4fr_1fr]': isEmpty(selectedMarket)
      })}
    >
      <HookedInputSelect
        name={fieldNameMarket}
        label={label}
        hint={hint}
        isLoading={isLoadingInitialValues || isLoadingDefaultResource}
        isClearable={false}
        isSearchable
        isDisabled={isDisabled}
        key={defaultMarketId}
        initialValues={initialValues}
        onSelect={(selected) => {
          const relatedCurrencyCode = flatSelectValues(
            selected,
            'meta.price_list.currency_code'
          )
          if (isString(relatedCurrencyCode) && !isEmpty(relatedCurrencyCode)) {
            setValue(
              fieldNameCurrencyCode,
              relatedCurrencyCode ?? defaultCurrencyCode
            )
          }
        }}
        menuFooterText={
          hasMorePages ? t('common.forms.type_to_search_for_more') : undefined
        }
        loadAsyncValues={
          hasMorePages
            ? async (hint) => {
                return await sdkClient.markets
                  .list({
                    pageSize: 25,
                    filters: {
                      name_cont: hint
                    },
                    fields: {
                      markets: ['name', 'price_list'],
                      price_lists: ['currency_code']
                    },
                    include: ['price_list']
                  })
                  .then((res) => {
                    return res.map((market) => ({
                      label: market.name,
                      value: market.id,
                      meta: market
                    }))
                  })
              }
            : undefined
        }
      />

      {isEmpty(selectedMarket) && (
        <HookedInputSelect
          name={fieldNameCurrencyCode}
          label='&nbsp;'
          aria-label={t('common.currency')}
          initialValues={currencyInputSelectOptions}
          key={defaultCurrencyCode}
          isDisabled={isDisabled}
        />
      )}
    </div>
  )
}

function makeSelectInitialValuesWithDefault<R extends Resource>({
  resourceList,
  defaultResource,
  fieldForLabel
}: {
  resourceList?: ListResponse<R>
  defaultResource?: R
  fieldForLabel: keyof R
}): InputSelectValue[] {
  const options = [
    defaultResource != null
      ? {
          label: (
            defaultResource[fieldForLabel] ?? defaultResource.id
          ).toString(),
          value: defaultResource.id
        }
      : undefined,
    ...(resourceList ?? []).map((item) => ({
      label: (item[fieldForLabel] ?? item.id).toString(),
      value: item.id,
      meta: item
    }))
  ].filter((v) => !isEmpty(v)) as InputSelectValue[]

  return options.sort((a, b) => a.label.localeCompare(b.label))
}

HookedMarketWithCurrencySelector.displayName =
  'HookedMarketWithCurrencySelector'

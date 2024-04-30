import { useCoreSdkProvider } from '#providers/CoreSdkProvider/CoreSdkProvider'
import {
  InputCurrencyRange,
  type InputCurrencyRangeProps
} from '#ui/forms/InputCurrencyRange'
import { type CommerceLayerClient, type PriceList } from '@commercelayer/sdk'
import { type ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  type CurrencyRangeFormValues,
  type FilterItemCurrencyRange
} from './types'

interface FieldCurrencyRangeProps {
  item: FilterItemCurrencyRange
}

export function FieldCurrencyRange({
  item
}: FieldCurrencyRangeProps): JSX.Element {
  const { control } = useFormContext()
  const fieldName = item.sdk.predicate

  const { sdkClient } = useCoreSdkProvider()
  const [currencyList, setCurrencyList] =
    useState<InputCurrencyRangeProps['currencyList']>()
  useEffect(() => {
    void fetchAllCurrencies({ sdkClient }).then(setCurrencyList)
  }, [])

  if (currencyList == null) {
    return <></>
  }

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <InputCurrencyRange
          {...item.render.props}
          currencyList={currencyList}
          fromCents={field.value?.from}
          toCents={field.value?.to}
          defaultCurrency={field.value?.currencyCode}
          onChange={(from, to, currency) => {
            const fieldValue: CurrencyRangeFormValues = {
              [fieldName]: {
                from: from.cents ?? null,
                to: to.cents ?? null,
                currencyCode: currency ?? null
              }
            }
            field.onChange(fieldValue[fieldName])
          }}
        />
      )}
    />
  )
}

interface FullList {
  currencies: string[]
  meta: {
    pageCount: number
    recordCount: number
    currentPage: number
    recordsPerPage: number
  }
}
async function fetchAllCurrencies({
  sdkClient
}: {
  sdkClient: CommerceLayerClient
}): Promise<InputCurrencyRangeProps['currencyList']> {
  const allCurrencies: FullList = {
    currencies: [],
    meta: {
      currentPage: 0,
      pageCount: 1,
      recordCount: 1,
      recordsPerPage: 25
    }
  }

  async function fetchPriceLists({
    pageNumber
  }: {
    pageNumber: number
  }): Promise<ListResponse<PriceList>> {
    return await sdkClient.price_lists.list({
      fields: ['currency_code'],
      pageSize: 25,
      pageNumber
    })
  }

  while (allCurrencies.meta.currentPage < allCurrencies.meta.pageCount) {
    const priceLists = await fetchPriceLists({
      pageNumber: allCurrencies.meta.currentPage + 1
    })
    allCurrencies.currencies = [
      ...allCurrencies.currencies,
      ...priceLists.map((item) => item.currency_code)
    ]
    allCurrencies.meta = priceLists.meta
  }

  const currencies = uniq(
    allCurrencies.currencies.filter((c) => !isEmpty(c))
  ).sort()

  return currencies as unknown as InputCurrencyRangeProps['currencyList']
}

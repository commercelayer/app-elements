import useSWR from 'swr'

export interface CountryOption {
  value: string
  label: string
}

const fetcher = async (url: string): Promise<CountryOption[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch countries')
  return await res.json()
}

/**
 * Custom hook to fetch and manage a static list of countries.
 * Utilizes SWR for data fetching with disabled revalidation, as the country list is static.
 * Returns an array of { value, label } objects suitable for use in select inputs.
 */
export function useCountryList(): {
  countries: CountryOption[] | undefined
  isLoading: boolean
  error: any
} {
  const { data, isLoading, error } = useSWR<CountryOption[]>(
    'https://data.commercelayer.app/assets/lists/countries.json',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  )

  return {
    countries: data,
    isLoading,
    error
  }
}

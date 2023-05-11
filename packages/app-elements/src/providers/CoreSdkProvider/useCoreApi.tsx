import type { CommerceLayerClient } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import useSWR, { type BareFetcher, type SWRConfiguration } from 'swr'
import { useCoreSdkProvider } from '.'

export const useCoreApi = <
  R extends ListableResourceType,
  A extends 'list' | 'retrieve',
  O extends CommerceLayerClient[R][A]
>(
  resource: R,
  action: A,
  args: Parameters<O>,
  config: SWRConfiguration<
    Awaited<ReturnType<O>> | undefined,
    any,
    BareFetcher<Awaited<ReturnType<O>> | undefined>
  > = {}
): {
  data: Awaited<ReturnType<O>> | undefined
  error: any
  isLoading: boolean
} => {
  const { sdkClient } = useCoreSdkProvider()

  const fetcher = async (
    args: Parameters<O>
  ): Promise<Awaited<ReturnType<O>> | undefined> => {
    if (sdkClient != null) {
      // @ts-expect-error I don't know how to fix it :(
      return await sdkClient[resource][action](...args)
    }
  }

  const { data, isLoading, error } = useSWR(
    args.length > 0 ? args : [{}],
    fetcher,
    {
      revalidateOnFocus: false,
      ...config
    }
  )

  return {
    data,
    isLoading,
    error
  }
}

import type { CommerceLayerClient } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import useSWR, { type BareFetcher, type SWRConfiguration } from 'swr'
import { useCoreSdkProvider } from '.'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useCoreApi = <
  Resource extends ListableResourceType,
  Action extends 'list' | 'retrieve',
  Method extends CommerceLayerClient[Resource][Action],
  Output extends Awaited<ReturnType<Method>>,
  SWRConfig extends SWRConfiguration<Output, any, BareFetcher<Output>>
>(
  resource: Resource,
  action: Action,
  args: Parameters<Method>,
  config?: SWRConfig
) => {
  const { sdkClient } = useCoreSdkProvider()

  const fetcher = async (args: Parameters<Method>): Promise<Output> => {
    // @ts-expect-error I don't know how to fix it :(
    return await sdkClient[resource][action](...args)
  }

  return useSWR(args.length > 0 ? args : [{}], fetcher, {
    revalidateOnFocus: false,
    ...config
  })
}

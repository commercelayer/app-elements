import type { CommerceLayerClient } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import useSWR, {
  type Fetcher,
  type SWRConfiguration,
  type SWRResponse
} from 'swr'
import { useCoreSdkProvider } from '.'

export function useCoreApi<
  Resource extends ListableResourceType,
  Action extends 'list' | 'retrieve',
  Method extends CommerceLayerClient[Resource][Action],
  Output extends Awaited<ReturnType<Method>>,
  SWROptions extends SWRConfiguration<Output, any, Fetcher<Output>>
>(
  resource: Resource,
  action: Action,
  args: Parameters<Method>,
  config?: SWROptions
): SWRResponse<Output, any, SWROptions> {
  const { sdkClient } = useCoreSdkProvider()

  const fetcher = async (args: Parameters<Method>): Promise<Output> => {
    // @ts-expect-error I don't know how to fix it :(
    return await sdkClient[resource][action](...args)
  }

  return useSWR(args.length > 0 ? args : [{}], fetcher, config)
}

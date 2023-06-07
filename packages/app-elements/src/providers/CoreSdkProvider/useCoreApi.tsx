import type { CommerceLayerClient } from '@commercelayer/sdk'
import { type ResourceTypeLock } from '@commercelayer/sdk/lib/cjs/api'
import useSWR, {
  type Fetcher,
  type SWRConfiguration,
  type SWRResponse
} from 'swr'
import { type ConditionalKeys } from 'type-fest'
import { useCoreSdkProvider } from '.'

type GenericMethod = (...args: any) => Promise<any>

type ForceToBeMethod<Method> = Method extends GenericMethod
  ? Method
  : GenericMethod

export function useCoreApi<
  Resource extends ResourceTypeLock,
  Action extends ConditionalKeys<CommerceLayerClient[Resource], GenericMethod>,
  Method extends ForceToBeMethod<CommerceLayerClient[Resource][Action]>,
  Args extends Parameters<Method>,
  Output extends Awaited<ReturnType<Method>>,
  SWROptions extends SWRConfiguration<Output, any, Fetcher<Output>>
>(
  resource: Resource,
  action: Action,
  args: Args,
  config?: SWROptions
): SWRResponse<Output, any, SWROptions> {
  const { sdkClient } = useCoreSdkProvider()

  const fetcher = async (args: Args): Promise<Output> => {
    // @ts-expect-error I don't know how to fix it :(
    return sdkClient[resource][action](...args)
  }

  return useSWR(args.length > 0 ? args : [{}], fetcher, config)
}

import type { CommerceLayerClient } from "@commercelayer/sdk"
import { useCallback } from "react"
import useSWR, {
  type Fetcher,
  type SWRConfiguration,
  type SWRResponse,
} from "swr"
import type { ConditionalKeys } from "type-fest"
import type { ResourceEndpoint } from "#helpers/resources"
import { useTokenProvider } from "#providers/TokenProvider"
import { useCoreSdkProvider } from "."

type GenericMethod = (...args: any) => Promise<any>

type ForceToBeMethod<Method> = Method extends GenericMethod
  ? Method
  : GenericMethod

/**
 * This hook performs api request base on [`@commercelayer/sdk`](https://github.com/commercelayer/commercelayer-sdk) and [`swr`](https://swr.vercel.app/).
 *
 * This is an example of getting the order with id `1234`.
 *
 * If you're used to use our sdk you can write:
 * ```ts
 * const order = await client.orders.retrieve('1234')
 * ```
 *
 * With `useCoreApi` you'll write instead:
 * ```ts
 * const {
 *   data: order,
 *   isLoading
 * } = useCoreApi('orders', 'retrieve', ['1234'])
 * ```
 * @param resource Resource type
 * @param action Related resource action
 * @param args Action arguments
 * @param config SWR options
 * @returns SWR response
 */
export function useCoreApi<
  Resource extends ResourceEndpoint,
  Action extends ConditionalKeys<CommerceLayerClient[Resource], GenericMethod>,
  Method extends ForceToBeMethod<CommerceLayerClient[Resource][Action]>,
  Args extends Parameters<Method>,
  Output extends Awaited<ReturnType<Method>>,
  SWROptions extends SWRConfiguration<Output, any, Fetcher<Output>>,
>(
  resource: Resource,
  action: Action,
  args: Args | null,
  config?: SWROptions,
): SWRResponse<Output, any, SWROptions> {
  const { sdkClient } = useCoreSdkProvider()
  const {
    settings: { mode },
  } = useTokenProvider()

  const fetcher = useCallback(
    async ([resource, action, args]: [
      resource: Resource,
      action: Action,
      args: Args,
    ]): Promise<Output> => {
      // @ts-expect-error I don't know how to fix it :(
      return sdkClient[resource][action](...args)
    },
    [sdkClient],
  )

  return useSWR(
    args !== null ? [resource, action, args, mode] : null,
    fetcher,
    config ?? {},
  )
}

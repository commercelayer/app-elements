import type { FetcherResponse } from "./listFetcher"

/**
 * Parameterised by the record shape, not by a resource type: nothing here depends
 * on which API the list came from, only on the records having an `id`.
 */
export interface ResourceListInternalState<TItem extends { id: string }> {
  isLoading: boolean
  error?: {
    message: string
  }
  data?: FetcherResponse<TItem> | undefined
}

export const initialState: ResourceListInternalState<{ id: string }> = {
  isLoading: true,
}

/** The same initial state, typed for the records this list will hold. */
export function createInitialState<
  TItem extends { id: string },
>(): ResourceListInternalState<TItem> {
  return { isLoading: true }
}

export type Action<TItem extends { id: string }> =
  | {
      type: "prepare"
    }
  | {
      type: "reset"
    }
  | {
      type: "loaded"
      payload: FetcherResponse<TItem>
    }
  | {
      type: "error"
      payload: string
    }
  | {
      type: "removeItem"
      payload: {
        resourceId: string
      }
    }

export const reducer = <TItem extends { id: string }>(
  state: ResourceListInternalState<TItem>,
  action: Action<TItem>,
): ResourceListInternalState<TItem> => {
  switch (action.type) {
    case "prepare":
      return {
        ...state,
        error: undefined,
        isLoading: true,
      }
    case "loaded":
      return {
        ...state,
        error: undefined,
        isLoading: false,
        data: action.payload,
      }
    case "error":
      return {
        ...state,
        isLoading: false,
        error: {
          message: action.payload,
        },
      }
    case "reset":
      return {
        ...state,
        error: undefined,
        isLoading: true,
        data: undefined,
      }
    case "removeItem":
      return {
        ...state,
        data:
          state.data?.list.find(
            (item) => item.id === action.payload.resourceId,
          ) != null
            ? {
                list: state.data.list.filter(
                  (item) => item.id !== action.payload.resourceId,
                ),
                meta: {
                  ...state.data.meta,
                  recordCount: state.data.meta.recordCount - 1,
                },
              }
            : state.data,
      }
  }
}

import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { type FetcherResponse, type Resource } from './infiniteFetcher'

interface ResourceListInternalState<TResource extends ListableResourceType> {
  isLoading: boolean
  error?: {
    message: string
  }
  data?: FetcherResponse<Resource<TResource>> | undefined
}

export const initialState: ResourceListInternalState<any> = {
  isLoading: true
}

type Action<TResource extends ListableResourceType> =
  | {
      type: 'prepare'
    }
  | {
      type: 'reset'
    }
  | {
      type: 'loaded'
      payload: FetcherResponse<Resource<TResource>>
    }
  | {
      type: 'error'
      payload: string
    }

export const reducer = <TResource extends ListableResourceType>(
  state: ResourceListInternalState<TResource>,
  action: Action<TResource>
): ResourceListInternalState<TResource> => {
  switch (action.type) {
    case 'prepare':
      return {
        ...state,
        error: undefined,
        isLoading: true
      }
    case 'loaded':
      return {
        ...state,
        error: undefined,
        isLoading: false,
        data: action.payload
      }
    case 'error':
      return {
        ...state,
        isLoading: false,
        error: {
          message: action.payload
        }
      }
    case 'reset':
      return {
        ...state,
        error: undefined,
        isLoading: true,
        data: undefined
      }
  }
}

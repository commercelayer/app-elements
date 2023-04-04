import {
  type FetcherResponse,
  type Resource,
  type ListableResource
} from './infiniteFetcher'

interface ResourceListInternalState<TResource extends ListableResource> {
  isLoading: boolean
  error?: {
    message: string
  }
  data?: FetcherResponse<Resource<TResource>> | undefined
}

export const initialState: ResourceListInternalState<any> = {
  isLoading: true
}

type Action<TResource extends ListableResource> =
  | {
      type: 'prepare'
    }
  | {
      type: 'loaded'
      payload: FetcherResponse<Resource<TResource>>
    }
  | {
      type: 'error'
      payload: string
    }

export const reducer = <TResource extends ListableResource>(
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
    default:
      return state
  }
}

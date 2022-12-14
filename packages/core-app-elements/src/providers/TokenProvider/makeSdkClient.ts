import CommerceLayer, {
  CommerceLayerClient,
  ErrorObj
} from '@commercelayer/sdk'
import { isEmpty } from 'lodash-es'

interface ApiReasonError {
  code: string
  detail: string
  status: string
  title: string
}

function isSdk401Error(error: ErrorObj): boolean {
  const errors = (error.response?.data as any)?.errors as
    | ApiReasonError[]
    | undefined
  return !isEmpty(errors) && Array.isArray(errors) && errors.length > 0
    ? errors.some((err) => err.code === 'INVALID_TOKEN')
    : false
}

export function makeSdkClient({
  accessToken,
  organization,
  domain,
  onInvalidToken
}: {
  accessToken: string
  organization: string
  domain?: string
  onInvalidToken: () => void
}): CommerceLayerClient {
  const client = CommerceLayer({
    accessToken,
    organization,
    domain
  })

  client.addResponseInterceptor(
    (success) => success,
    (error) => {
      if (isSdk401Error(error)) {
        onInvalidToken()
      }
      throw error
    }
  )

  return client
}

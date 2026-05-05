import { CommerceLayerStatic } from "@commercelayer/sdk"

export interface ApiError {
  code: string
  detail: string
  status: string
  title: string
}

export function parseApiError(
  err: any,
  fallback: string = "Something went wrong. Please try again.",
): ApiError[] {
  if (err == null) {
    return []
  }

  if (CommerceLayerStatic.isApiError(err) && Array.isArray(err.errors)) {
    return err.errors
  } else {
    return [
      {
        code: "Generic error",
        detail: err.message ?? fallback,
        status: "500",
        title: err.message ?? "Generic error",
      },
    ]
  }
}

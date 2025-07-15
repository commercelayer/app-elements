import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "#ui/atoms/Button"
import { Container } from "#ui/atoms/Container"
import { EmptyState } from "#ui/atoms/EmptyState"

interface Props {
  children?: ReactNode
  errorTitle?: string
  errorDescription?: string
  onRetry?: () => void
  hasContainer?: boolean
}

interface State {
  error?: Error
  hasError: boolean
}

/**
 * ErrorBoundary component that catches errors in its children and displays a fallback UI.
 * In case of error name is ChunkLoadError it will display a different message.
 * When the `onRetry` callback is provided, the retry button will call it, so it can be used to reset internal state
 */
export class ErrorBoundary extends Component<Props, State> {
  static displayName = "ErrorBoundary"

  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error?.name, error, errorInfo)
  }

  public render(): ReactNode {
    const inner =
      this.state.error?.name === "ChunkLoadError" ? (
        <EmptyState
          title="Update required"
          description="This app has been updated, please refresh the page to access the new content."
          icon="cloudArrowUp"
          action={
            <Button
              onClick={() => {
                window.location.reload()
              }}
            >
              Reload
            </Button>
          }
        />
      ) : (
        <EmptyState
          title={this.props.errorTitle ?? "Something went wrong"}
          description={
            this.props.errorDescription ??
            "Try to reload the page and start again"
          }
          action={
            <Button
              onClick={() => {
                if (this.props.onRetry != null) {
                  this.props.onRetry()
                } else {
                  window.location.reload()
                }
              }}
            >
              Retry
            </Button>
          }
        />
      )

    if (this.state.hasError) {
      return this.props.hasContainer === true ? (
        <Container className="pt-14">{inner}</Container>
      ) : (
        inner
      )
    }

    return this.props.children
  }
}

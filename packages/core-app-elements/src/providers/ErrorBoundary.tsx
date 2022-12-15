import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '#ui/atoms/Button'
import { Container } from '#ui/atoms/Container'
import { EmptyState } from '#ui/atoms/EmptyState'

interface Props {
  children?: ReactNode
  errorTitle?: string
  errorDescription?: string
  onRetry?: () => void
  hasContainer?: boolean
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render(): ReactNode {
    const inner = (
      <EmptyState
        title={this.props.errorTitle ?? 'Something went wrong'}
        description={
          this.props.errorDescription ??
          'Try to reload the page and start again'
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
        <Container className='pt-14'>{inner}</Container>
      ) : (
        inner
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

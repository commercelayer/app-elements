import { Container } from '#ui/atoms/Container'
import { PageHeading, type PageHeadingProps } from '#ui/atoms/PageHeading'
import { type ReactNode } from 'react'

export interface OverlayLayoutProps
  extends Pick<
    PageHeadingProps,
    'title' | 'description' | 'onGoBack' | 'actionButton' | 'gap'
  > {
  /**
   * Page content
   */
  children: ReactNode
  /**
   * When mode is `test`, it will render a `TEST DATA` Badge to inform user api is working in test mode.
   */
  mode?: 'test' | 'live'
}

export function OverlayLayout({
  title,
  description,
  onGoBack,
  children,
  actionButton,
  mode,
  gap,
  ...rest
}: OverlayLayoutProps): JSX.Element {
  return (
    <Container minHeight={false} {...rest}>
      <PageHeading
        title={title}
        description={description}
        onGoBack={onGoBack}
        actionButton={actionButton}
        badgeLabel={mode === 'test' ? 'TEST DATA' : undefined}
        badgeVariant={mode === 'test' ? 'warning-solid' : undefined}
        gap={gap}
      />
      {children}
    </Container>
  )
}

OverlayLayout.displayName = 'OverlayLayout'

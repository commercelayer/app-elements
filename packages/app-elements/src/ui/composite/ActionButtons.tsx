import { Button, type ButtonVariant } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { useMemo, type MouseEventHandler } from 'react'

export interface ActionButtonsProps {
  actions: Array<{
    label: string
    onClick: MouseEventHandler<HTMLButtonElement>
    variant?: ButtonVariant
    disabled?: boolean
  }>
}

export const ActionButtons = withSkeletonTemplate<ActionButtonsProps>(
  ({ actions }): JSX.Element | null => {
    const isPrimary = (
      action: ActionButtonsProps['actions'][number]
    ): boolean => action.variant == null || action.variant === 'primary'

    const primaryActions = useMemo(
      () => actions.filter((action) => isPrimary(action)),
      [actions]
    )

    const secondaryActions = useMemo(
      () => actions.filter((action) => !isPrimary(action)),
      [actions]
    )

    if (actions.length === 0) {
      return null
    }

    return (
      <div
        data-testid='action-buttons'
        className='flex justify-end border-b border-gray-100 py-6'
      >
        {primaryActions.length === 1 && secondaryActions.length === 0 ? (
          <>
            {primaryActions.map(({ label, ...props }) => (
              <Button className='w-full' key={label} {...props}>
                {label}
              </Button>
            ))}
          </>
        ) : (
          <>
            <div className='basis-1/2 flex gap-3'>
              {secondaryActions.map(({ label, ...props }) => (
                <Button key={label} {...props}>
                  {label}
                </Button>
              ))}
            </div>
            <div className='basis-1/2 flex gap-3 justify-end'>
              {primaryActions.map(({ label, ...props }) => (
                <Button key={label} {...props}>
                  {label}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
)

ActionButtons.displayName = 'ActionButtons'

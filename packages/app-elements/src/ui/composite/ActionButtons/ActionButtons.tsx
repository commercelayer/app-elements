import { type MouseEventHandler, useMemo } from "react"
import { Button, type ButtonProps } from "#ui/atoms/Button"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"

export interface ActionButtonsProps {
  actions: Array<{
    label: string
    onClick: MouseEventHandler<HTMLButtonElement>
    variant?: ButtonProps["variant"]
    disabled?: boolean
  }>
}

export const ActionButtons = withSkeletonTemplate<ActionButtonsProps>(
  ({ actions }) => {
    const isPrimary = (
      action: ActionButtonsProps["actions"][number],
    ): boolean => action.variant == null || action.variant === "primary"

    const primaryActions = useMemo(
      () => actions.filter((action) => isPrimary(action)),
      [actions],
    )

    const secondaryActions = useMemo(
      () => actions.filter((action) => !isPrimary(action)),
      [actions],
    )

    if (actions.length === 0) {
      return null
    }

    return (
      <div
        data-testid="action-buttons"
        className="flex flex-col-reverse lg:flex-row justify-end border-b border-gray-100 py-6 gap-4 md:gap-2"
      >
        {primaryActions.length === 1 && secondaryActions.length === 0 ? (
          primaryActions.map(({ label, ...props }) => (
            <Button key={label} {...props} fullWidth className="lg:w-auto">
              {label}
            </Button>
          ))
        ) : (
          <>
            {secondaryActions.map(({ label, ...props }) => (
              <Button key={label} {...props} fullWidth className="lg:w-auto">
                {label}
              </Button>
            ))}
            {primaryActions.map(({ label, ...props }) => (
              <Button key={label} {...props} fullWidth className="lg:w-auto">
                {label}
              </Button>
            ))}
          </>
        )}
      </div>
    )
  },
)

ActionButtons.displayName = "ActionButtons"

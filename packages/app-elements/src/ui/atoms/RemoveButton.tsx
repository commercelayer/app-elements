import { TrashIcon } from "@phosphor-icons/react"
import { Children, type JSX } from "react"
import { Button } from "./Button"

export interface RemoveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** Remove button is simply a button with attached an icon that highlight the functionality. */
export function RemoveButton({
  children,
  className,
  ...rest
}: RemoveButtonProps): JSX.Element {
  return (
    <Button variant="link" alignItems="center" {...rest}>
      <TrashIcon size={18} weight="bold" />
      {Children.count(children) >= 1 && (
        <span className="pl-1">{children}</span>
      )}
    </Button>
  )
}

RemoveButton.displayName = "RemoveButton"

import cn from "classnames"
import type { FC, ReactNode } from "react"

export interface ModalFooterButtonsProps {
  /**
   * The buttons placed bottom right, in reading order: the secondary ones
   * first, the primary one last.
   */
  children: ReactNode
  /**
   * An action kept apart, bottom left — such as adding a row to the form in the
   * body.
   */
  start?: ReactNode
}

/**
 * Lays out the buttons of a `Modal.Footer`: bottom right, with an optional
 * action apart on the left.
 *
 * On very small viewports, where they would not fit side by side, every button
 * goes full width and they stack, the primary one on top.
 */
export const ModalFooterButtons: FC<ModalFooterButtonsProps> = ({
  children,
  start,
}) => {
  // the children are stretched full width when stacked: the classes go on the
  // buttons' direct parent, since a button is only as wide as its own content
  const stretchChildren = "*:w-full min-[480px]:*:w-auto"

  return (
    <div
      data-testid="modal-footer-buttons"
      className={cn(
        "flex flex-col-reverse gap-2",
        "min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-4",
      )}
    >
      {start != null && <div className={stretchChildren}>{start}</div>}
      <div
        className={cn(
          "flex flex-col-reverse gap-2",
          "min-[480px]:flex-row min-[480px]:items-center min-[480px]:ml-auto",
          stretchChildren,
        )}
      >
        {children}
      </div>
    </div>
  )
}

ModalFooterButtons.displayName = "ModalFooterButtons"

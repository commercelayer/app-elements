import { createContext, useContext } from "react"

/**
 * The modal `<dialog>` the calling component sits in, given out by `Modal` and by
 * `Overlay`.
 *
 * An open modal dialog lives in the browser's top layer and makes everything
 * outside it inert: a floating panel portalled anywhere else — the body included —
 * opens behind it and cannot be clicked. The dialog itself is full screen and does
 * not clip its children, so it is where such a panel belongs, with no ref for the
 * app to pass down.
 *
 * Its own context rather than part of `OverlayContext`, which `PageLayout` provides
 * again for its sidebar: a page laid out inside an overlay would lose the dialog.
 */
export const DialogPortalContext = createContext<HTMLElement | null>(null)

/** The dialog to portal floating panels into, `null` outside of one. */
export function useDialogPortalTarget(): HTMLElement | null {
  return useContext(DialogPortalContext)
}

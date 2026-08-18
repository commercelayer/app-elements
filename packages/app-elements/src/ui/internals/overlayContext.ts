import { createContext, useContext } from "react"

/**
 * Tells content whether it is being rendered inside a drawer.
 *
 * Its own module rather than living in `Overlay`, so components that adapt to the
 * drawer (`PageHeading`) do not have to import the component that renders them.
 */
export const OverlayContext = createContext<{ isDrawer: boolean }>({
  isDrawer: false,
})

/**
 * `true` when the calling component sits inside a drawer, `false` on a page or in
 * a full-screen overlay.
 */
export function useIsInDrawer(): boolean {
  return useContext(OverlayContext).isDrawer
}

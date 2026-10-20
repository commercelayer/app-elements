import { createContext, useContext } from "react"

/**
 * Where content is being rendered, so that it can adapt without every page passing
 * a prop down.
 *
 * - `"page"` — the main column of a page, the widest surface.
 * - `"drawer"` — inside a drawer, 680px from `md` up.
 * - `"sidebar"` — `PageLayout`'s sidebar slot, a 380px column from `lg` up.
 * - `"modal"` — the body of a `Modal`, a centered dialog at most 620px wide.
 *
 * Below the width at which each surface takes its own shape, all three are just
 * full-width rows, so anything that adapts should differ only in `md:`/`lg:`-
 * prefixed classes and read the same on a phone.
 */
export type Surface = "page" | "drawer" | "sidebar" | "modal"

/**
 * Its own module rather than living in `Overlay` or `PageLayout`, so components that
 * adapt to a surface (`PageHeading`, `ResourceDetails`) do not have to import the
 * components that render them.
 */
export const OverlayContext = createContext<{ surface: Surface }>({
  surface: "page",
})

/** Where the calling component is being rendered. */
export function useSurface(): Surface {
  return useContext(OverlayContext).surface
}

/**
 * `true` when the calling component sits inside a drawer, `false` on a page, in the
 * sidebar or in a full-screen overlay.
 */
export function useIsInDrawer(): boolean {
  return useSurface() === "drawer"
}

/**
 * The renderings a block can pick from where it sits: the narrow sidebar column, a
 * modal, or everything else. A page and a drawer differ in width but not in how
 * blocks lay out, so they share one.
 *
 * A block with no rendering of its own for `"modal"` treats it as `"default"`.
 */
export type SurfaceVariant = "default" | "sidebar" | "modal"

/** The rendering the calling component should use, from where it sits. */
export function useSurfaceVariant(): SurfaceVariant {
  const surface = useSurface()
  return surface === "sidebar" || surface === "modal" ? surface : "default"
}

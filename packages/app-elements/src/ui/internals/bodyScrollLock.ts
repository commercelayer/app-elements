/**
 * Reference-counted body scroll lock, shared by every component that covers the
 * page: `Modal` and `Overlay`.
 *
 * More than one of them can be open at a time — a confirmation dialog inside a
 * details drawer, an edit overlay inside that same drawer — and they all mutate
 * the one `document.body.style.overflow`. A component that closes must therefore
 * never restore the body on its own: the counter keeps the body locked from the
 * first one that opens until the last one closes, and puts back whatever inline
 * value the page had before.
 */
let lockCount = 0
let previousBodyOverflow = ""

export function lockBodyScroll(): void {
  if (lockCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
  }
  lockCount += 1
}

export function unlockBodyScroll(): void {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = ""
  }
}

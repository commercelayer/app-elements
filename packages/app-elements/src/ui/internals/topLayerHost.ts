/**
 * A modal `<dialog>` puts everything outside it under the top layer and
 * makes it inert, so a toast rendered in the app root would show up behind an open
 * drawer or modal and never be announced.
 *
 * Toasts are therefore portalled into this host node, and every modal dialog that
 * opens moves the host inside itself, handing it back to the dialog underneath
 * (or to the body) when it closes. React only owns what is inside the host, so
 * moving the host itself around is safe.
 *
 * The same stack of open dialogs also routes Escape, see `cancelTopmostDialog`.
 */
const stack: HTMLElement[] = []
let host: HTMLDivElement | null = null

export function getTopLayerHost(): HTMLDivElement {
  if (host == null) {
    host = document.createElement("div")
    host.dataset.topLayerHost = ""
    document.body.appendChild(host)
  }
  return host
}

function placeHost(): void {
  const target = stack[stack.length - 1] ?? document.body
  const node = getTopLayerHost()
  if (node.parentElement !== target) {
    target.appendChild(node)
  }
}

/**
 * Escape on a modal `<dialog>` fires `cancel`, and every dialog here cancels it
 * to close through its own state, or not at all. Chrome honours that only once
 * per user activation: a second Escape in a row skips `cancel` and closes the
 * dialog natively, behind React's back. The component then stays mounted on a
 * closed dialog, keeping the body scroll lock, and its opener can no longer open
 * it, as its state already says "open".
 *
 * Escape is therefore taken away from the browser and handed to the topmost
 * dialog as a `cancel` event, whose handler decides as before. A key already
 * handled (an open select menu, a select handing it on itself) is left alone.
 * Listening on the document also covers the focus having fallen on the body.
 */
function cancelTopmostDialog(event: KeyboardEvent): void {
  const dialog = stack[stack.length - 1]
  if (event.key !== "Escape" || event.defaultPrevented || dialog == null) {
    return
  }
  event.preventDefault()
  dialog.dispatchEvent(new Event("cancel", { cancelable: true }))
}

export function enterTopLayer(dialog: HTMLElement): void {
  if (stack.length === 0) {
    document.addEventListener("keydown", cancelTopmostDialog)
  }
  stack.push(dialog)
  placeHost()
}

export function leaveTopLayer(dialog: HTMLElement): void {
  const index = stack.lastIndexOf(dialog)
  if (index !== -1) {
    stack.splice(index, 1)
  }
  if (stack.length === 0) {
    document.removeEventListener("keydown", cancelTopmostDialog)
  }
  placeHost()
}

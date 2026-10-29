/**
 * A modal `<dialog>` puts everything outside it under the top layer and
 * makes it inert, so a toast rendered in the app root would show up behind an open
 * drawer or modal and never be announced.
 *
 * Toasts are therefore portalled into this host node, and every modal dialog that
 * opens moves the host inside itself, handing it back to the dialog underneath
 * (or to the body) when it closes. React only owns what is inside the host, so
 * moving the host itself around is safe.
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

export function enterTopLayer(dialog: HTMLElement): void {
  stack.push(dialog)
  placeHost()
}

export function leaveTopLayer(dialog: HTMLElement): void {
  const index = stack.lastIndexOf(dialog)
  if (index !== -1) {
    stack.splice(index, 1)
  }
  placeHost()
}

import type { Address, Attachment, Email } from "postal-mime"
import { useEffect, useMemo, useState } from "react"
import { formatDate } from "#helpers/date"
import { t } from "#providers/i18n"
import { useTokenProvider } from "#providers/TokenProvider"
import { A } from "#ui/atoms/A"
import { Hr } from "#ui/atoms/Hr"
import { SkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"

export interface EmailMessageProps {
  /**
   * Where the raw message (RFC 822, an `.eml` file) can be fetched from, such as
   * an inbound message's `raw_payload_url`. Fetched without credentials, so a
   * cross-origin URL has to allow the page's origin (CORS).
   */
  src: string
}

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "loaded"; email: Email }

/**
 * Renders an email from its raw message: subject, sender, recipients, date,
 * body and attachments.
 *
 * The message is someone else's content, so an HTML body goes in a sandboxed
 * iframe: no scripts, no forms, links open in a new tab, and nothing is loaded
 * from the network — remote images included, which also keeps tracking pixels
 * from reporting the read. Inline images that come with the message are shown.
 * When the message can't be fetched or parsed, it falls back to a link to it.
 */
export const EmailMessage: React.FC<EmailMessageProps> = ({ src }) => {
  const { user } = useTokenProvider()
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: "loading" })

    void (async () => {
      try {
        const response = await fetch(src, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`)
        }
        const raw = await response.arrayBuffer()
        // loaded on first use only: most pages never open an email
        const { default: PostalMime } = await import("postal-mime")
        const email = await PostalMime.parse(raw, {
          attachmentEncoding: "base64",
        })
        setState({ status: "loaded", email })
      } catch {
        if (!controller.signal.aborted) {
          setState({ status: "error" })
        }
      }
    })()

    return () => {
      controller.abort()
    }
  }, [src])

  if (state.status === "error") {
    return (
      <div data-testid="EmailMessage-error">
        <Text tag="div" variant="info" size="small">
          {t("common.email_message.could_not_load")}
        </Text>
        <Spacer top="2">
          <A href={src} target="_blank" rel="noreferrer">
            {t("common.email_message.download")}
          </A>
        </Spacer>
      </div>
    )
  }

  const email = state.status === "loaded" ? state.email : undefined
  const date = email?.date != null ? new Date(email.date) : undefined

  const rows: Array<[label: string, value: string | undefined]> = [
    [t("common.from"), formatAddresses(email?.from)],
    [t("common.to"), formatAddresses(email?.to)],
    [t("common.email_message.cc"), formatAddresses(email?.cc)],
    [
      t("common.email_message.date"),
      date != null && !Number.isNaN(date.getTime())
        ? formatDate({
            isoDate: date.toISOString(),
            timezone: user?.timezone,
            format: "full",
            showCurrentYear: true,
            locale: user?.locale,
          })
        : email?.date,
    ],
  ]

  return (
    <SkeletonTemplate isLoading={state.status === "loading"}>
      <div data-testid="EmailMessage">
        <Text tag="div" weight="semibold">
          {state.status === "loading"
            ? "Loading the email subject"
            : (email?.subject ?? t("common.email_message.no_subject"))}
        </Text>
        <Spacer top="2">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {rows
              .filter(([, value]) => state.status === "loading" || value)
              .map(([label, value]) => (
                <Row key={label} label={label} value={value ?? label} />
              ))}
          </div>
        </Spacer>
        <Spacer top="4" bottom="4">
          <Hr />
        </Spacer>
        {email != null ? (
          <EmailBody email={email} />
        ) : (
          <Text tag="div" size="small">
            Loading the email body, which can be several lines long.
          </Text>
        )}
        {email != null && <EmailAttachments email={email} />}
      </div>
    </SkeletonTemplate>
  )
}

EmailMessage.displayName = "EmailMessage"

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <>
    <Text tag="div" size="small" variant="info">
      {label}
    </Text>
    {/* `min-w-0`, or a long list of recipients would widen the grid */}
    <Text tag="div" size="small" className="min-w-0 wrap-break-word">
      {value}
    </Text>
  </>
)

const EmailBody: React.FC<{ email: Email }> = ({ email }) => {
  const srcDoc = useMemo(
    () =>
      email.html != null && email.html.trim() !== ""
        ? toSandboxedDocument(email.html, email.attachments)
        : undefined,
    [email],
  )
  const [height, setHeight] = useState<number>()

  if (srcDoc != null) {
    return (
      <iframe
        title={email.subject ?? t("common.email_message.no_subject")}
        data-testid="EmailMessage-html"
        // same origin, so the frame can be sized to its content; with no
        // `allow-scripts` nothing in it runs. Popups let its links open in a
        // tab of their own, outside the sandbox.
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        srcDoc={srcDoc}
        className="w-full border-0"
        style={{ height: height ?? 320 }}
        onLoad={(event) => {
          const document = event.currentTarget.contentDocument
          // the body, not the root: the root is never shorter than the
          // frame, so the frame could only ever grow
          if (document != null) {
            setHeight(document.body.scrollHeight)
          }
        }}
      />
    )
  }

  if (email.text != null && email.text.trim() !== "") {
    return (
      <Text
        tag="div"
        size="small"
        data-testid="EmailMessage-text"
        className="whitespace-pre-wrap wrap-break-word"
      >
        {email.text.trim()}
      </Text>
    )
  }

  return (
    <Text tag="div" size="small" variant="info">
      {t("common.email_message.no_content")}
    </Text>
  )
}

const EmailAttachments: React.FC<{ email: Email }> = ({ email }) => {
  // inline images are already in the body
  const files = email.attachments.filter(
    (attachment) =>
      attachment.disposition !== "inline" || attachment.contentId == null,
  )

  if (files.length === 0) {
    return null
  }

  return (
    <Spacer top="6">
      <Text tag="div" size="small" weight="semibold">
        {t("common.attachments")}
      </Text>
      <Spacer top="2">
        <ul className="grid gap-1">
          {files.map((file, index) => (
            <li
              // attachments have no id, and the list never changes
              // biome-ignore lint/suspicious/noArrayIndexKey: see above
              key={index}
              className="flex gap-2"
            >
              <A
                href={`data:${file.mimeType};base64,${String(file.content)}`}
                download={file.filename ?? "attachment"}
              >
                {file.filename ?? file.mimeType}
              </A>
              <Text size="small" variant="info">
                {formatSize(file)}
              </Text>
            </li>
          ))}
        </ul>
      </Spacer>
    </Spacer>
  )
}

/**
 * The HTML body as a standalone document for the iframe's `srcdoc`, which
 * loads nothing from outside the message.
 *
 * Two layers, because neither is enough on its own:
 * - the markup is cleaned first, in a `DOMParser` document, which loads
 *   nothing: Chrome fetches the images in a `srcdoc`'s markup while parsing it,
 *   before the document's own content security policy applies;
 * - that policy then covers what the cleaning can't see, such as images in
 *   CSS.
 *
 * Inline images, referenced as `cid:`, are swapped for their data.
 */
function toSandboxedDocument(html: string, attachments: Attachment[]): string {
  const inlineImages = new Map<string, string>(
    attachments.flatMap((attachment) => {
      const contentId = attachment.contentId?.replace(/^<|>$/g, "")
      return contentId == null || contentId === ""
        ? []
        : [
            [
              `cid:${contentId}`,
              `data:${attachment.mimeType};base64,${String(attachment.content)}`,
            ] as [string, string],
          ]
    }),
  )

  const document = new DOMParser().parseFromString(html, "text/html")

  for (const element of document.querySelectorAll(blockedElements)) {
    element.remove()
  }
  // a form's fields stay, as text the reader can see; the sandbox already
  // stops them from submitting
  for (const form of document.querySelectorAll("form")) {
    form.replaceWith(...form.childNodes)
  }
  for (const element of document.querySelectorAll("*")) {
    for (const { name, value } of [...element.attributes]) {
      const attribute = name.toLowerCase()
      if (attribute.startsWith("on")) {
        element.removeAttribute(name)
      } else if (
        resourceAttributes.has(attribute) ||
        // only a link's `href` waits for a click: on SVG's `image` or `use`
        // it loads
        (attribute === "href" && !["a", "area"].includes(element.localName))
      ) {
        const source = inlineImages.get(value.trim()) ?? value.trim()
        if (source.startsWith("data:")) {
          element.setAttribute(name, source)
        } else {
          element.removeAttribute(name)
        }
      }
    }
  }

  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:"><meta name="referrer" content="no-referrer"><base target="_blank"><style>body{margin:0;display:flow-root;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;color:#101111;overflow-wrap:anywhere}img{max-width:100%;height:auto}</style>${document.head.innerHTML}</head><body>${document.body.innerHTML}</body></html>`
}

/** Elements that run code, load something, or change how the frame behaves. */
const blockedElements =
  "script, noscript, iframe, frame, frameset, object, embed, applet, link, meta, base, portal"

/**
 * Attributes that load a resource. Each keeps its value only when the message
 * itself carries the data.
 */
const resourceAttributes = new Set([
  "src",
  "srcset",
  "background",
  "poster",
  "data",
  "action",
  "formaction",
  "xlink:href",
  "lowsrc",
  "dynsrc",
])

function formatAddresses(
  addresses: Address | Address[] | undefined,
): string | undefined {
  if (addresses == null) {
    return undefined
  }
  const list = Array.isArray(addresses) ? addresses : [addresses]
  const formatted = list
    .flatMap((address) => (address.group != null ? address.group : [address]))
    .map((mailbox) =>
      mailbox.name !== "" && mailbox.name !== mailbox.address
        ? `${mailbox.name} <${mailbox.address}>`
        : (mailbox.address ?? ""),
    )
    .filter((value) => value !== "")
  return formatted.length > 0 ? formatted.join(", ") : undefined
}

function formatSize(attachment: Attachment): string {
  // base64 carries 3 bytes in every 4 characters, less its padding
  const content = String(attachment.content)
  const bytes =
    Math.floor((content.length * 3) / 4) -
    (content.match(/=+$/)?.[0].length ?? 0)
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

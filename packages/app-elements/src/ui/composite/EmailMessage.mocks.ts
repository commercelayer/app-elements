/**
 * Raw messages (RFC 822) for `EmailMessage`'s tests and stories.
 *
 * The HTML one carries what the component must neutralize: a script, an event
 * handler, remote images (as tracking pixels would be, one of them in SVG) and
 * a form; and an inline image it must show.
 */
export const presetEmails = {
  html: [
    "From: Jane Buyer <jane@example.com>",
    "To: orders@agents.example.com",
    "Cc: Purchasing <purchasing@example.com>",
    "Subject: Order PO-1042",
    "Date: Wed, 11 Nov 2026 16:57:00 +0100",
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="mixed"',
    "",
    "--mixed",
    'Content-Type: multipart/alternative; boundary="alt"',
    "",
    "--alt",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "Hello, please send the items below. Thanks, Jane",
    "",
    "--alt",
    "Content-Type: text/html; charset=utf-8",
    "",
    "<p>Hello,</p><p>please send the items below.</p>",
    '<table border="1" cellpadding="4"><tr><th>SKU</th><th>Qty</th></tr><tr><td>TSHIRT-M-BLK</td><td>12</td></tr><tr><td>TSHIRT-L-WHT</td><td>6</td></tr></table>',
    "<p>Thanks,<br>Jane</p>",
    '<script>window.parent.document.title = "pwned"</script>',
    '<p><img src="cid:logo@example.com" alt="Logo" width="16" height="16"></p>',
    '<img src="https://tracker.example.com/open.gif" width="1" height="1" onerror="window.parent.document.title = \'pwned\'">',
    '<svg width="1" height="1"><image href="https://tracker.example.com/svg.gif" /></svg>',
    '<form action="https://example.com/steal"><input name="q"></form>',
    "--alt--",
    "",
    "--mixed",
    "Content-Type: image/png",
    "Content-ID: <logo@example.com>",
    "Content-Disposition: inline",
    "Content-Transfer-Encoding: base64",
    "",
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "",
    "--mixed",
    'Content-Type: text/csv; name="order.csv"',
    'Content-Disposition: attachment; filename="order.csv"',
    "Content-Transfer-Encoding: base64",
    "",
    "U0tVLFF1YW50aXR5ClRTSElSVC1NLUJMSywxMgpUU0hJUlQtTC1XSFQsNgo=",
    "--mixed--",
    "",
  ].join("\r\n"),
  text: [
    "From: jane@example.com",
    "To: orders@agents.example.com",
    "Subject: =?utf-8?Q?Ordine_n=C2=B0_1043?=",
    "Date: Thu, 12 Nov 2026 09:15:00 +0100",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    "Buongiorno,",
    "vorrei ordinare 3 x TSHIRT-M-BLK, consegna a Milano.",
    "Grazie",
    "",
  ].join("\r\n"),
} as const

/** A message as a `data:` URL, which `fetch` reads like a remote file. */
export function toDataUrl(raw: string): string {
  return `data:message/rfc822,${encodeURIComponent(raw)}`
}

import { render, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { MockTokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../mocks/server"
import { EmailMessage } from "./EmailMessage"
import { presetEmails } from "./EmailMessage.mocks"

const emailUrl = "https://storage.example.com/inbound/message.eml"

const setup = (raw: string | null) => {
  server.use(
    http.get(emailUrl, () =>
      raw == null
        ? new HttpResponse(null, { status: 403 })
        : new HttpResponse(raw, {
            headers: { "Content-Type": "message/rfc822" },
          }),
    ),
  )
  return render(
    <MockTokenProvider kind="integration" appSlug="orders" devMode>
      <EmailMessage src={emailUrl} />
    </MockTokenProvider>,
  )
}

describe("EmailMessage", () => {
  test("shows the headers, and the HTML body in a sandbox", async () => {
    const { getByText, getByTestId } = setup(presetEmails.html)

    await waitFor(() => {
      expect(getByText("Order PO-1042")).toBeVisible()
    })
    expect(getByText("Jane Buyer <jane@example.com>")).toBeVisible()
    expect(getByText("orders@agents.example.com")).toBeVisible()
    expect(getByText("Purchasing <purchasing@example.com>")).toBeVisible()

    const frame = getByTestId("EmailMessage-html")
    const sandbox = frame.getAttribute("sandbox") ?? ""
    expect(sandbox).not.toContain("allow-scripts")
    expect(sandbox).not.toContain("allow-forms")
    expect(sandbox).not.toContain("allow-top-navigation")

    const srcDoc = frame.getAttribute("srcdoc") ?? ""
    expect(srcDoc).toContain("TSHIRT-M-BLK")
    // cleaned before it reaches the frame, which would fetch the images in its
    // markup before its own policy applies
    expect(srcDoc).not.toContain("tracker.example.com")
    expect(srcDoc).not.toContain("<script")
    expect(srcDoc).not.toContain("onerror")
    expect(srcDoc).not.toContain("<form")
    // the inline image is shown, from the message's own data
    expect(srcDoc).toContain('src="data:image/png;base64,iVBORw0KGgo')
    // nothing is loaded from outside the message
    expect(srcDoc).toContain(
      "default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:",
    )
  })

  test("lists the attachments, to download, but not the inline images", async () => {
    const { findByText, queryByText } = setup(presetEmails.html)

    const link = await findByText("order.csv")
    expect(link.closest("a")).toHaveAttribute("download", "order.csv")
    expect(link.closest("a")?.getAttribute("href")).toMatch(
      /^data:text\/csv;base64,/,
    )
    expect(queryByText("image/png")).toBeNull()
  })

  test("shows a plain text body as text, with encoded headers decoded", async () => {
    const { findByText, getByTestId, queryByTestId } = setup(presetEmails.text)

    expect(await findByText("Ordine n° 1043")).toBeVisible()
    expect(getByTestId("EmailMessage-text")).toHaveTextContent(
      "vorrei ordinare 3 x TSHIRT-M-BLK, consegna a Milano.",
    )
    expect(queryByTestId("EmailMessage-html")).toBeNull()
  })

  test("falls back to a link when the message can't be fetched", async () => {
    const { findByTestId, getByText } = setup(null)

    expect(await findByTestId("EmailMessage-error")).toBeVisible()
    expect(
      getByText("common.email_message.download").closest("a"),
    ).toHaveAttribute("href", emailUrl)
  })
})

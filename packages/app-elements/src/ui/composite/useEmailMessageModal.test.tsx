import { fireEvent, render, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { MockTokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../mocks/server"
import { presetEmails } from "./EmailMessage.mocks"
import { useEmailMessageModal } from "./useEmailMessageModal"

const emailUrl = "https://storage.example.com/inbound/message.eml"

const Opener: React.FC<{ src: string | null }> = ({ src }) => {
  const { emailModal, openEmailModal } = useEmailMessageModal({ src })
  return (
    <>
      <button type="button" onClick={openEmailModal}>
        open
      </button>
      {emailModal}
    </>
  )
}

describe("useEmailMessageModal", () => {
  test("fetches the email only once opened", async () => {
    const fetched = vi.fn()
    server.use(
      http.get(emailUrl, () => {
        fetched()
        return new HttpResponse(presetEmails.text)
      }),
    )
    const { getByText, findByText } = render(
      <MockTokenProvider kind="integration" appSlug="orders" devMode>
        <Opener src={emailUrl} />
      </MockTokenProvider>,
    )

    expect(fetched).not.toHaveBeenCalled()

    fireEvent.click(getByText("open"))

    expect(await findByText("Ordine n° 1043")).toBeInTheDocument()
    expect(fetched).toHaveBeenCalledTimes(1)
    expect(
      getByText("common.email_message.download").closest("a"),
    ).toHaveAttribute("href", emailUrl)
  })

  test("renders nothing without a message", async () => {
    const { getByText, queryByText } = render(
      <MockTokenProvider kind="integration" appSlug="orders" devMode>
        <Opener src={null} />
      </MockTokenProvider>,
    )

    fireEvent.click(getByText("open"))

    await waitFor(() => {
      expect(queryByText("common.email_message.title")).toBeNull()
    })
  })
})

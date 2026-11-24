import type { Meta, StoryFn } from "@storybook/react-vite"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { EmailMessage } from "#ui/composite/EmailMessage"
import { presetEmails, toDataUrl } from "#ui/composite/EmailMessage.mocks"

const setup: Meta<typeof EmailMessage> = {
  title: "Composite/EmailMessage",
  component: EmailMessage,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <Story />
      </TokenProvider>
    ),
  ],
}
export default setup

const Template: StoryFn<typeof EmailMessage> = (args) => (
  <EmailMessage {...args} />
)

/**
 * An HTML email with an attachment. Its script, remote image and form are
 * neutralized by the sandbox: the script doesn't run and the image isn't
 * requested.
 */
export const Default = Template.bind({})
Default.args = {
  src: toDataUrl(presetEmails.html),
}

/** A plain text email, with an encoded subject. */
export const PlainText = Template.bind({})
PlainText.args = {
  src: toDataUrl(presetEmails.text),
}

/** The message couldn't be fetched: a link to it instead. */
export const NotLoaded = Template.bind({})
NotLoaded.args = {
  src: "https://storage.example.com/inbound/missing.eml",
}

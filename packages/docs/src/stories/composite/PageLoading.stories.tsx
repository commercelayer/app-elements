import type { Meta, StoryObj } from "@storybook/react-vite"
import { useEffect, useState } from "react"
import { Table, Td, Th, Tr } from "#ui/atoms/Table"
import { Text } from "#ui/atoms/Text"
import { PageLayout } from "#ui/composite/PageLayout"
import { PageLoading } from "#ui/composite/PageLoading"

const meta: Meta<typeof PageLoading> = {
  title: "Composite/PageLoading",
  component: PageLoading,
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof PageLoading>

/**
 * Replaces the former `PageSkeleton`, which hand-drew a search bar and a list of
 * rows and therefore had to be kept in step with every screen it stood in for.
 * This one draws only what holds before the page is known: the frame, the band the
 * title will occupy, and a spinner.
 */
export const Default: Story = {
  args: {
    delayMs: 0,
  },
}

/**
 * Nothing is drawn until the delay elapses, so a page that resolves quickly never
 * flashes an indicator. Exaggerated to 1s here to make the wait visible — the
 * default is 200ms. Reload the story to watch it appear.
 */
export const WithDelay: Story = {
  args: {
    delayMs: 1000,
  },
}

/** For the full-width pages: the frame matches, so content does not shift. */
export const FullWidth: Story = {
  args: {
    delayMs: 0,
    fullWidth: true,
  },
}

/**
 * The point of the pattern is the handoff. This waits 1.5s, then swaps in a real
 * page: the title lands in the band that was already reserved for it, so only the
 * content below appears.
 */
export const TransitionToPage: Story = {
  render: () => <LoadThenRender />,
}

function LoadThenRender(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [])

  if (isLoading) {
    return <PageLoading delayMs={0} fullWidth />
  }

  return (
    <PageLayout title="Orders" gap="only-top" fullWidth minHeight={false}>
      <Table
        thead={
          <Tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Status</Th>
          </Tr>
        }
        tbody={rows.map((row) => (
          <Tr key={row.number}>
            <Td>
              <Text weight="medium">{row.number}</Text>
            </Td>
            <Td>{row.customer}</Td>
            <Td>{row.status}</Td>
          </Tr>
        ))}
      />
    </PageLayout>
  )
}

const rows = [
  { number: "#19273", customer: "ringo@commercelayer.io", status: "Approved" },
  { number: "#19272", customer: "john@commercelayer.io", status: "Placed" },
  { number: "#19271", customer: "paul@commercelayer.io", status: "Fulfilled" },
]

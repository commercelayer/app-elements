import {
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks"
import type { Meta, StoryFn } from "@storybook/react-vite"
import { useConfirmDialog } from "#hooks/useConfirmDialog"
import { Button } from "#ui/atoms/Button"
import { ToastContainer } from "#ui/composite/Toast"

/**
 * Hook that returns a blocking confirmation dialog along with a `show()` method to open it.
 * Visibility is fully managed internally — the dialog can only be dismissed via the confirm
 * or cancel buttons (backdrop click and Escape key are disabled).
 *
 * The confirm action is an async function; both buttons are disabled while it is pending.
 * If the async action rejects, an error toast is shown automatically and the dialog closes.
 *
 * Example usage:
 * ```tsx
 * const { show, ConfirmDialog } = useConfirmDialog()
 *
 * return (
 *   <>
 *     <Button onClick={show}>Delete</Button>
 *     <ConfirmDialog
 *       icon="trash"
 *       title="Delete item"
 *       description="Are you sure you want to delete this item?"
 *       confirm={{ label: "Delete", variant: "danger", onClick: handleDelete }}
 *     />
 *   </>
 * )
 * ```
 */
const setup: Meta = {
  title: "Hooks/useConfirmDialog",
  args: {},
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <ToastContainer />
          <Primary />
          <Stories includePrimary={false} />
        </>
      ),
      source: {
        type: "code",
      },
    },
  },
}
export default setup

/**
 * Delete confirmation dialog. Use `variant="danger"` for destructive actions.
 */
export const DeleteAction: StoryFn = () => {
  const { show, ConfirmDialog } = useConfirmDialog()

  return (
    <div>
      <Button variant="danger" onClick={show}>
        Delete item
      </Button>
      <ConfirmDialog
        icon="trash"
        title="Delete promotion Welcome Discount 10?"
        description="This action can’t be undone."
        confirm={{
          label: "Delete",
          variant: "danger",
          onClick: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500))
          },
        }}
        successMessage="Promotion deleted!"
      />
    </div>
  )
}

/**
 * Confirm action dialog. Use `variant="primary"` (the default) for non-destructive confirmations.
 */
export const ConfirmAction: StoryFn = () => {
  const { show, ConfirmDialog } = useConfirmDialog()

  return (
    <div>
      <Button onClick={show}>Capture payment</Button>
      <ConfirmDialog
        icon="check"
        title="Do you want to capture the payment of $100.00 for order #12345?"
        confirm={{
          label: "Capture",
          variant: "primary",
          onClick: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500))
          },
        }}
        successMessage="Payment captured!"
      />
    </div>
  )
}

/**
 * When the async confirm action rejects, the dialog closes and an error toast is shown.
 * A custom `errorMessage` can be provided — either a static string or a function receiving
 * the caught error.
 */
export const AsyncError: StoryFn = () => {
  const { show, ConfirmDialog } = useConfirmDialog()

  return (
    <div>
      <Button onClick={show}>Trigger failing action</Button>
      <ConfirmDialog
        icon="warning"
        title="Confirm action"
        description="This action will fail. Confirm to see the error toast."
        confirm={{
          label: "Confirm",
          variant: "primary",
          onClick: async () => {
            await new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Server error")), 1500),
            )
          },
        }}
        errorMessage="This is a custom error message."
      />
    </div>
  )
}

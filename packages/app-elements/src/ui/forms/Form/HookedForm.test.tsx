import { zodResolver } from "@hookform/resolvers/zod"
import { fireEvent, render, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { HookedForm } from "./HookedForm"

const schema = z.object({
  name: z.string().min(1),
  quantity: z.preprocess((value) => Number(value), z.number().int()),
  notes: z.string().default("none"),
})

const Form: FC<{
  onSubmit: (values: z.output<typeof schema>) => void
}> = ({ onSubmit }) => {
  const methods = useForm({
    defaultValues: { name: "Shirt", quantity: "3" },
    resolver: zodResolver(schema),
  })
  return (
    <HookedForm {...methods} onSubmit={onSubmit}>
      <button type="submit">Submit</button>
    </HookedForm>
  )
}

describe("HookedForm", () => {
  test("should submit the values as returned by the resolver", async () => {
    const onSubmit = vi.fn()
    const { getByText } = render(<Form onSubmit={onSubmit} />)

    fireEvent.click(getByText("Submit"))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Shirt",
        quantity: 3,
        notes: "none",
      })
    })
  })
})

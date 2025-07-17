import classNames from "classnames"
import type React from "react"
import {
  type Id,
  ToastContainer as OriginalToastContainer,
  toast as originalToast,
  type ToastContentProps,
  type ToastOptions,
} from "react-toastify"
import { Icon } from "#ui/atoms/Icon"

export const ToastContainer = (): React.JSX.Element => {
  return (
    <OriginalToastContainer
      newestOnTop
      position="bottom-right"
      hideProgressBar
      autoClose={5000}
      closeOnClick={false}
      pauseOnHover
      closeButton={false}
    />
  )
}

export function toast<TData = unknown>(
  content: string,
  { type }: Options<TData> = { type: "default" },
): Id {
  interface ToastData {
    content: string
  }

  const Msg = ({
    closeToast,
    data,
  }: ToastContentProps<ToastData>): React.JSX.Element => {
    return (
      <div className="border border-white/10 min-h-max p-0 text-white flex w-full">
        <div className="flex-grow py-3 px-4 text-sm leading-5 font-semibold">
          {data.content}
        </div>
        <button
          type="button"
          className={classNames("border-l border-white/10 p-3 self-stretch")}
          onClick={() => {
            closeToast()
          }}
        >
          <Icon size={16} name="x" className="flex-grow cursor-pointer" />
        </button>
      </div>
    )
  }

  return originalToast<ToastData>(Msg, {
    className: classNames("border-0 p-0 min-h-max", {
      "bg-black": type === "default",
      "bg-green-600": type === "success",
      "bg-red-700": type === "error",
    }),
    data: { content },
    icon: false,
    type,
  })
}

interface Options<Data = unknown> {
  type: Exclude<NonNullable<ToastOptions<Data>["type"]>, "info" | "warning">
}

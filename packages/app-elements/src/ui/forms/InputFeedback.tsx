import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import cn from "classnames";
import type { JSX } from "react";

type FeedbackVariant = "danger" | "success" | "warning";

export interface InputFeedbackProps {
  message: string;
  variant?: FeedbackVariant;
  className?: string;
}

export function InputFeedback({
  className,
  message,
  variant = "danger",
  ...rest
}: InputFeedbackProps): JSX.Element {
  const icons: Record<FeedbackVariant, JSX.Element> = {
    danger: (
      <WarningCircleIcon size={20} weight="bold" data-testid="icon-danger" />
    ),
    success: (
      <CheckCircleIcon size={20} weight="bold" data-testid="icon-success" />
    ),
    warning: (
      <WarningCircleIcon size={20} weight="bold" data-testid="icon-warning" />
    ),
  };

  return (
    <div
      className={cn([
        className,
        "flex items-center gap-1",
        {
          "text-red": variant === "danger",
          "text-green": variant === "success",
          "text-orange": variant === "warning",
        },
      ])}
      {...rest}
    >
      {icons[variant]}
      <div className="text-sm font-semibold">{message}</div>
    </div>
  );
}

InputFeedback.displayName = "InputFeedback";

import cn from "classnames"
import { useCallback, useMemo } from "react"

interface Step {
  label: string
  active?: boolean
}

export interface StepsProps {
  steps: Step[]
}

export const Steps: React.FC<StepsProps> = ({ steps }) => {
  const lastActiveIndex = useMemo(
    () => steps.findLastIndex((step) => step.active === true),
    [steps],
  )

  const fixActive = useCallback(
    (step: Step, index: number): Step => {
      if (index < lastActiveIndex) {
        return {
          ...step,
          active: true,
        }
      }

      return step
    },
    [lastActiveIndex],
  )

  return (
    <ul
      style={{
        backgroundPosition:
          lastActiveIndex > 0
            ? `${(lastActiveIndex / (steps.length - 1)) * 100 * -1}%`
            : "",
      }}
      className={cn(
        "flex justify-between text-xs w-full items-center rounded",
        `h-2 mb-8 bg-linear-to-r from-gray-100 from-50% to-primary to-50% bg-size-[200%]`,
      )}
    >
      {steps.map(fixActive).map((step, index) => {
        const position =
          index === 0 ? "first" : index === steps.length - 1 ? "last" : "other"

        const activePosition =
          index < lastActiveIndex
            ? "before"
            : index === lastActiveIndex
              ? "active"
              : "after"

        return (
          <li
            key={step.label}
            className={cn("relative", {
              "text-gray-400 font-medium": activePosition === "before",
              "text-black font-semibold": activePosition === "active",
              "text-gray-300 font-medium": activePosition === "after",
            })}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex justify-center items-center",
                {
                  "bg-primary": step.active === true,
                  "bg-gray-100": step.active !== true,
                  "after:bg-white after:w-3 after:h-3 after:block after:rounded-full":
                    activePosition === "active",
                },
              )}
            />
            <div
              className={cn("absolute whitespace-nowrap mt-1", {
                "translate-x-0": position === "first",
                "translate-x-[calc(-50%+12px)]": position === "other",
                "right-0": position === "last",
              })}
            >
              {step.label}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

Steps.displayName = "Steps"

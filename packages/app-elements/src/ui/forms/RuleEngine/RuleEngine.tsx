import type React from "react"
import { lazy, Suspense } from "react"
import { SkeletonItem } from "#ui/atoms/Skeleton"
import type { RuleEngineProps } from "./RuleEngineComponent"

const LazyRuleEngine = lazy(
  async () =>
    await import("./RuleEngineComponent").then((module) => ({
      default: module.RuleEngine,
    })),
)

export const RuleEngine: React.FC<RuleEngineProps> = (props) => {
  return (
    <Suspense fallback={<SkeletonItem className="h-11 w-full" />}>
      <LazyRuleEngine {...props} />
    </Suspense>
  )
}

RuleEngine.displayName = "RuleEngine"

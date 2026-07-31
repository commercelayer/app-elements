// biome-ignore lint/correctness/noUnusedImports: React is used in the render method
import React from "react"
import { Separator, ToggleButton } from "storybook/internal/components"
import { ADDON_NAME, LINK_URL, TOOL_ID, VERSION } from "./constants"

export const Tool = () => {
  return (
    <>
      <Separator />
      <ToggleButton
        key={TOOL_ID}
        title={ADDON_NAME}
        active={false}
        pressed={false}
        onClick={() => {
          window.open(LINK_URL, "_blank")
        }}
      >
        v{VERSION}
      </ToggleButton>
    </>
  )
}

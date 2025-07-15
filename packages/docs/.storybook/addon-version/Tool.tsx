import { IconButton, Separator } from 'storybook/internal/components'
import React from 'react'
import { ADDON_NAME, LINK_URL, TOOL_ID, VERSION } from './constants'



export const Tool = () => {
  return (
    <>
      <Separator />
      <IconButton
        key={TOOL_ID}
        title={ADDON_NAME}
        active={false}
        onClick={() => {
          window.open(LINK_URL, '_blank')
        }}
      >
        v{VERSION}
      </IconButton>
    </>
  )
}

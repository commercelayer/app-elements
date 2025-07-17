import { type FC, useCallback } from "react"
import { useOverlay } from "#hooks/useOverlay"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { CodeEditor } from "#ui/forms/CodeEditor/CodeEditorComponent"

interface OverlayProps {
  title: string
  json: JSON
}

interface ViewJsonOverlayHook {
  showJsonOverlay: () => void
  JsonOverlay: FC<OverlayProps>
}

export function useViewJsonOverlay(): ViewJsonOverlayHook {
  const { Overlay, open, close } = useOverlay()

  const OverlayComponent: ViewJsonOverlayHook["JsonOverlay"] = useCallback(
    ({ title, json }) => {
      return (
        <Overlay drawer onBackdropClick={close}>
          <div className="flex flex-col h-full">
            <div className="bg-white p-6 flex justify-between">
              <Text weight="semibold">{title}</Text>
              <button type="button" onClick={close}>
                <Icon name="x" weight="bold" />
              </button>
            </div>
            <CodeEditor
              language="json"
              defaultValue={JSON.stringify(json, null, 2)}
              readOnly
              height={"100%"}
              noRounding
            />
          </div>
        </Overlay>
      )
    },
    [Overlay],
  )

  return {
    showJsonOverlay: open,
    JsonOverlay: OverlayComponent,
  }
}

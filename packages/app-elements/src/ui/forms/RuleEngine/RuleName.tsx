import { useEffect, useState } from "react"
import { useRuleEngine } from "./RuleEngineContext"

export function RuleName(): React.JSX.Element {
  const {
    setPath,
    state: { value, selectedRuleIndex },
  } = useRuleEngine()
  const [name, setName] = useState<string>(
    value.rules?.[selectedRuleIndex]?.name ?? "",
  )

  useEffect(() => {
    setName(value.rules?.[selectedRuleIndex]?.name ?? "")
  }, [selectedRuleIndex])

  return (
    // <Input
    //   value={value.rules?.[selectedRuleIndex]?.name}
    //   onChange={(event) => {
    //     const target = event.currentTarget
    //     const value = target.value.replace(/[\n\s]+/g, " ").trim()
    //     setPath(`rules.${selectedRuleIndex}.name`, value)
    //   }}
    //   className="bg-transparent border-0 shadow-none field-sizing-content"
    // />

    // biome-ignore lint/a11y/noStaticElementInteractions: This <div> is used with contentEditable
    <div
      key={selectedRuleIndex}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      onInput={(event) => {
        const target = event.currentTarget
        const value = target.innerText.replace(/[\n\s]+/g, " ").trim()
        setPath(`rules.${selectedRuleIndex}.name`, value)
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          event.currentTarget.blur()
        }
      }}
      onBlur={(event) => {
        const target = event.currentTarget
        target.innerText = target.innerText.replace(/[\n\s]+/g, " ").trim()
      }}
    >
      {name}
    </div>
  )
}

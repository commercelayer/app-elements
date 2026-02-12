import { useState } from "react"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaActionItem } from "../utils"
import { ActionListItem } from "./ActionListItem"

export function Action({
  actions,
}: {
  actions?: SchemaActionItem[]
}): React.JSX.Element {
  const [rerenderKey, setRerenderKey] = useState(0)
  const {
    setPath,
    state: { selectedRuleIndex },
  } = useRuleEngine()

  return (
    <>
      <div>
        {actions?.map((action, actionIndex, actionArray) => (
          <ActionListItem
            key={`${selectedRuleIndex}-${actionIndex}-${rerenderKey}`}
            item={action}
            index={actionIndex}
            onDelete={
              actionArray.length > 1
                ? () => {
                    setRerenderKey((prevKey) => prevKey + 1)
                  }
                : undefined
            }
          />
        ))}
      </div>
      <div className="mt-6">
        <Button
          size="small"
          variant="secondary"
          alignItems="center"
          onClick={() => {
            setPath(
              `rules.${selectedRuleIndex}.actions.${actions?.length ?? 0}`,
              {
                selector: "order.line_items",
              },
            )
          }}
        >
          <Icon name="plusCircle" /> Add action
        </Button>
      </div>
    </>
  )
}

import type React from "react"
import { useState } from "react"
import { Icon } from "#ui/atoms/Icon"
import { Dropdown } from "#ui/composite/Dropdown"
import { OptionContainer } from "./OptionContainer"

export const ListItemContainer: React.FC<{
  children: React.ReactNode
  dropdownItems?: React.ReactNode
  options?: React.ReactNode
}> = ({ children, dropdownItems, options }) => {
  const [optionVisibility, setOptionVisibility] = useState<boolean>(true)

  return (
    <div className="bg-gray-50 rounded-md flex items-center">
      <div className="flex items-center justify-between gap-2 grow p-2">
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {children}

            {/* Actions */}
            <div className="border border-gray-200 rounded self-stretch flex">
              <button
                type="button"
                onClick={() => {
                  setOptionVisibility((prev) => !prev)
                }}
                className="w-11 flex self-stretch justify-center items-center"
              >
                <Icon
                  name={optionVisibility ? "caretUp" : "caretDown"}
                  size={16}
                />
              </button>
              {dropdownItems != null && (
                <Dropdown
                  className="flex self-stretch border-gray-100 border-l"
                  dropdownLabel={
                    <button
                      type="button"
                      className="w-11 flex self-stretch justify-center items-center"
                    >
                      <Icon name="dotsThreeVertical" size={16} weight="bold" />
                    </button>
                  }
                  dropdownItems={dropdownItems}
                />
              )}
            </div>
          </div>

          {optionVisibility && <OptionContainer>{options}</OptionContainer>}
        </div>
      </div>
    </div>
  )
}

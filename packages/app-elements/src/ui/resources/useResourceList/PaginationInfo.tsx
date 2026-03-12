import type { JSX } from "react"
import { Icon } from "#ui/atoms/Icon"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { makeCurrentPageOffsets } from "#utils/pagination"

export interface PaginationInfoProps {
  currentPage: number
  pageCount: number
  recordsPerPage: number
  recordCount: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export function PaginationInfo({
  currentPage,
  pageCount,
  recordsPerPage,
  recordCount,
  isLoading,
  onPageChange,
}: PaginationInfoProps): JSX.Element {
  const offsets = makeCurrentPageOffsets({
    currentPage,
    recordsPerPage,
    recordCount,
  })

  return (
    <Spacer top="6">
      <div className="flex items-center justify-between mt-auto">
        <Text variant="info" tag="div" size="x-small">
          {offsets.firstOfPage.toLocaleString()}-
          {offsets.lastOfPage.toLocaleString()} of{" "}
          {recordCount.toLocaleString()}
        </Text>
        <div className="flex gap-2 items-center justify-between text-xs">
          <button
            type="button"
            disabled={isLoading || currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-2 disabled:opacity-30 rounded-[8px] border border-gray-200"
          >
            <Icon name="caretRight" className="rotate-180" />
          </button>
          <button
            type="button"
            disabled={isLoading || currentPage === pageCount}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-2 disabled:opacity-30 rounded-[8px] border border-gray-200"
          >
            <Icon name="caretRight" />
          </button>
        </div>
      </div>
    </Spacer>
  )
}

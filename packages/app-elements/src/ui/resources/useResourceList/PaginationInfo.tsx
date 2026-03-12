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
        <Text
          variant="info"
          tag="div"
          size="x-small"
          aria-live="polite"
          aria-atomic="true"
        >
          {offsets.firstOfPage.toLocaleString()}-
          {offsets.lastOfPage.toLocaleString()} of{" "}
          {recordCount.toLocaleString()}
        </Text>
        <div className="flex gap-2 items-center justify-between text-xs">
          <button
            type="button"
            aria-label="Previous page"
            aria-disabled={isLoading || currentPage === 1}
            disabled={isLoading || currentPage === 1}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              onPageChange(currentPage - 1)
            }}
            className="p-2 disabled:opacity-30 rounded-[8px] border border-gray-200"
          >
            <Icon name="caretRight" className="rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            aria-disabled={isLoading || currentPage === pageCount}
            disabled={isLoading || currentPage === pageCount}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              onPageChange(currentPage + 1)
            }}
            className="p-2 disabled:opacity-30 rounded-[8px] border border-gray-200"
          >
            <Icon name="caretRight" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Spacer>
  )
}

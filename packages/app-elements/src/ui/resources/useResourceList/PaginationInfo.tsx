import type { JSX } from "react"
import { t } from "#providers/i18n"
import { Icon } from "#ui/atoms/Icon"
import { Spacer, type SpacerProps } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { makeCurrentPageOffsets } from "#utils/pagination"

export interface PaginationInfoProps {
  currentPage: number
  pageCount: number
  recordsPerPage: number
  recordCount: number
  isLoading: boolean
  onPageChange: (page: number) => void
  /**
   * Room above the pager. Tighter in a nested list, such as a relationship.
   * @default "6"
   */
  top?: SpacerProps["top"]
}

export function PaginationInfo({
  currentPage,
  pageCount,
  recordsPerPage,
  recordCount,
  isLoading,
  onPageChange,
  top = "6",
}: PaginationInfoProps): JSX.Element {
  // `aria-disabled` rather than `disabled`: a disabled button drops keyboard
  // focus, which would happen on every click while the next page loads.
  const isPreviousDisabled = isLoading || currentPage === 1
  const isNextDisabled = isLoading || currentPage === pageCount
  const offsets = makeCurrentPageOffsets({
    currentPage,
    recordsPerPage,
    recordCount,
  })

  return (
    <Spacer top={top}>
      <div className="flex items-center justify-between mt-auto">
        <Text
          variant="info"
          tag="div"
          size="x-small"
          aria-live="polite"
          aria-atomic="true"
        >
          {t("common.pagination_range", {
            first: offsets.firstOfPage.toLocaleString(),
            last: offsets.lastOfPage.toLocaleString(),
            total: recordCount.toLocaleString(),
          })}
        </Text>
        <div className="flex gap-2 items-center justify-between text-xs">
          <button
            type="button"
            aria-label={t("common.previous_page")}
            aria-disabled={isPreviousDisabled}
            onClick={() => {
              if (!isPreviousDisabled) {
                onPageChange(currentPage - 1)
              }
            }}
            className="p-2 bg-white aria-disabled:opacity-30 aria-disabled:cursor-default rounded-[8px] border border-gray-200"
          >
            <Icon name="caretRight" className="rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t("common.next_page")}
            aria-disabled={isNextDisabled}
            onClick={() => {
              if (!isNextDisabled) {
                onPageChange(currentPage + 1)
              }
            }}
            className="p-2 bg-white aria-disabled:opacity-30 aria-disabled:cursor-default rounded-[8px] border border-gray-200"
          >
            <Icon name="caretRight" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Spacer>
  )
}

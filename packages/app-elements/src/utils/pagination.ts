/**
 * Helper function to retrieve the first and last index of the current page
 * Example: To show `1-50 of 148` or `51-100 of 148` or `100-148 of 148` we can do `${firstOfPage}-${lastOfPage} of ${recordCount}`
 * @param currentPage - The current active page (Int)
 * @param recordsPerPage - Number of items listed in a single page (Int)
 * @param recordCount - Number of the total items from all pages (Int)
 * @returns an object containing `firstOfPage` which is the first index of the current page (on page 2 with 30 items per page will be 31)
 *          and  `lastOfPage` which is the last index of the current page (on page 2 with 30 items per page will be 60)
 */
export function makeCurrentPageOffsets({
  currentPage,
  recordsPerPage,
  recordCount
}: {
  currentPage: number
  recordsPerPage: number
  recordCount: number
}): {
  firstOfPage: number
  lastOfPage: number
} {
  const firstOfPage = recordsPerPage * currentPage - (recordsPerPage - 1)
  const lastOffset = currentPage * recordsPerPage

  return {
    firstOfPage,
    lastOfPage: lastOffset >= recordCount ? recordCount : lastOffset
  }
}

/**
 * Helper function to make a list of adjacent pages.
 * It will consider the final and first page to avoid generating not existing pages.
 * Example: If current page is 3 and we want to generate 5 adjacents it could return
 * [3,4,5,6,7] or [1,2,3] depending on the direction we are looking for.
 * @param currentPage - The current active page (Int)
 * @param pageCount - The total number of pages (Int)
 * @param adjacentPagesCount - How many adjacent pages we need to generate (Int)
 * @param direction - The direction we need to look for. It could be `forward` or `backward`
 * @param excludeCurrentPage - Boolean flag, in case we don't need the current page to be in the array
 * @returns an array of adjacent page numbers
 */
export function makeSomeAdjacentPages({
  currentPage,
  pageCount,
  adjacentPagesCount,
  direction = 'forward',
  excludeCurrentPage = false
}: {
  currentPage: number
  pageCount: number
  adjacentPagesCount: number
  direction?: 'backward' | 'forward'
  excludeCurrentPage?: boolean
}): number[] {
  if (
    currentPage == null ||
    pageCount == null ||
    pageCount < currentPage ||
    currentPage <= 0 ||
    pageCount < 1
  ) {
    return []
  }

  const initialPage = excludeCurrentPage
    ? direction === 'forward'
      ? currentPage + 1
      : currentPage - 1
    : currentPage

  const pages = Array.from({ length: adjacentPagesCount }, (_, i) => {
    const computedIndex =
      direction === 'forward' ? initialPage + i : initialPage - i

    return computedIndex <= pageCount && computedIndex >= 1
      ? computedIndex
      : null
  }).filter(notNull)

  return direction === 'forward' ? pages : pages.reverse()
}

function notNull<T>(value: T | null): value is T {
  return value != null
}

export function computeTitleWithPagination({
  title,
  firstOfPage,
  lastOfPage,
  recordCount,
  currentPage
}: {
  title: string
  firstOfPage: number
  lastOfPage: number
  recordCount: number
  currentPage: number
}): string {
  if (currentPage === 1) {
    return `${title} · ${recordCount}`
  }

  return `${title} · ${firstOfPage}-${lastOfPage} of ${recordCount}`
}

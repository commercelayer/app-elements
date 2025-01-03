import { t } from '#providers/I18NProvider'
import { Table, Td, Th, Tr } from '#ui/atoms/Table'
import { extractHeaders } from '#utils/extractHeaders'
import { isJsonPrimitive } from '#utils/text'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import type { JsonObject } from 'type-fest'

export interface TableDataProps {
  /** Data to render in the table */
  data: JsonObject[]
  /** CSS classes */
  className?: string
  /** Number of items to display in the table */
  limit?: number
  /** Table title */
  title?: string
  /** Show the total number of items beside the title */
  showTotal?: boolean
  /** Show the remaining item count when setting a `limit` */
  showOthers?: boolean
}

/**
 * This component can render an array of JSON objects inside a table.
 */
export function TableData({
  data,
  className,
  limit,
  title,
  showTotal,
  showOthers,
  ...rest
}: TableDataProps): JSX.Element {
  const headings = extractHeaders(data)
  const rows = data.slice(0, limit)
  const othersCount = limit != null ? data.length - limit : 0

  return (
    <div className={cn('', className)} {...rest}>
      <div className='flex justify-between items-center mb-2'>
        {title != null ? <h2 className='font-semibold'>{title}</h2> : <div />}
        {showTotal === true && data != null ? (
          <div className='text-sm' data-testid='table-total-string'>
            {t('common.table.record', { count: data.length })}
          </div>
        ) : null}
      </div>
      <div className='overflow-x-auto pb-3'>
        <Table
          thead={
            <Tr data-testid='table-row-header'>
              {headings.map((heading) => (
                <Th key={heading}>{heading}</Th>
              ))}
            </Tr>
          }
          tbody={rows.map((row, rowIndex) => (
            <Tr key={`r${rowIndex}`} data-testid='table-row-content'>
              {headings.map((cell, cellIndex) => {
                const value = row[cell]

                return (
                  <Td key={`r${rowIndex}_${cellIndex}`} textEllipsis={20}>
                    {isEmpty(value?.toString())
                      ? '-'
                      : isJsonPrimitive(value)
                        ? value?.toString()
                        : Array.isArray(value)
                          ? '[ ... ]'
                          : '{ ... }'}
                  </Td>
                )
              })}
            </Tr>
          ))}
        />
      </div>
      {othersCount > 0 && showOthers === true ? (
        <div
          className='py-1 text-sm text-right'
          data-testid='table-others-string'
        >
          {othersCount === 1 ? (
            <span data-testid='table-others-string-single'>
              {t('common.table.and_another_record')}
            </span>
          ) : (
            <span data-testid='table-others-string-multiple'>
              {t('common.table.and_other_records', { count: othersCount })}
            </span>
          )}
        </div>
      ) : null}
    </div>
  )
}

TableData.displayName = 'TableData'

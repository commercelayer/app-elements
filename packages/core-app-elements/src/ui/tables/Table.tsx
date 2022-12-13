import cn from 'classnames'
import { isEmpty } from 'lodash-es'
import { extractHeaders } from '#utils/extractHeaders'

export interface TableProps {
  data: Array<Record<string, string | Object>>
  className?: string
  limit?: number
  title?: string
  showTotal?: boolean
  showOthers?: boolean
}

export function Table({
  data,
  className,
  limit,
  title,
  showTotal,
  showOthers,
  ...rest
}: TableProps): JSX.Element {
  const headings = extractHeaders(data)
  const rows = data.slice(0, limit)
  const othersCount = limit != null ? data.length - limit : 0

  return (
    <div className={cn('overflow-x-auto pb-3', className)} {...rest}>
      <div className='flex justify-between'>
        {title != null ? (
          <h2 className='font-semibold mb-2'>{title}</h2>
        ) : (
          <div />
        )}
        {showTotal === true ? (
          <div className='text-sm' data-test-id='table-total-string'>
            {data.length} records
          </div>
        ) : null}
      </div>
      <table className='w-full rounded overflow-hidden'>
        <thead>
          <tr data-test-id='table-row-header'>
            {headings.map((heading) => (
              <TableHeader key={heading} value={heading} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={`r${rowIndex}`}
              data-test-id='table-row-content'
              className='border-b'
            >
              {headings.map((cell, cellIndex) => (
                <TableCell
                  key={`r${rowIndex}_${cellIndex}`}
                  value={row[cell]}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {othersCount > 0 && showOthers === true ? (
        <div
          className='py-4 text-sm text-right'
          data-test-id='table-others-string'
        >
          {othersCount === 1
            ? 'and another record'
            : `and others ${othersCount} records`}
        </div>
      ) : null}
    </div>
  )
}

function TableHeader({ value }: { value: string }): JSX.Element {
  return (
    <th className='text-xs uppercase p-4 bg-gray-50 text-gray-400 text-left'>
      {value}
    </th>
  )
}

function TableCell({ value }: { value?: string | object }): JSX.Element {
  const isString = typeof value === 'string' || typeof value === 'number'
  return (
    <td className='p-4'>
      <div
        title={isString && value.length > 20 ? value : undefined}
        className='text-sm w-28 h-6 overflow-hidden text-ellipsis whitespace-nowrap'
      >
        {isString ? value : isEmpty(value) ? '-' : '{...}'}
      </div>
    </td>
  )
}

export default Table

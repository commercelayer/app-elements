import { isJsonPrimitive } from '#utils/text'
import cn from 'classnames'

interface Props {
  className?: string
  children?: React.ReactNode
  textEllipsis?: number
}

export const Td: React.FC<Props> = ({ children, className, textEllipsis }) => {
  return (
    <td className={cn('p-4 text-sm border-b border-gray-100', className)}>
      {textEllipsis !== undefined ? (
        <div
          title={
            isJsonPrimitive(children) &&
            children !== null &&
            children.toString().length > textEllipsis
              ? children.toString()
              : undefined
          }
          className='overflow-hidden text-ellipsis whitespace-nowrap'
          style={{ maxWidth: `${textEllipsis}ch` }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </td>
  )
}

Td.displayName = 'Td'

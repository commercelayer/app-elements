import { isJsonPrimitive } from '#utils/text'
import cn from 'classnames'
import {
  SkeletonTemplate,
  type SkeletonTemplateProps
} from '../SkeletonTemplate'

export interface TdProps
  extends React.TdHTMLAttributes<HTMLElement>,
    SkeletonTemplateProps {
  children?: React.ReactNode
  textEllipsis?: number
}

export const Td: React.FC<TdProps> = ({
  children,
  className,
  textEllipsis,
  isLoading,
  delayMs,
  ...rest
}) => {
  return (
    <td
      className={cn('p-4 text-sm border-b border-gray-100 bg-white', className)}
      {...rest}
    >
      <SkeletonTemplate isLoading={isLoading} delayMs={delayMs}>
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
      </SkeletonTemplate>
    </td>
  )
}

Td.displayName = 'Td'

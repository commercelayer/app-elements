import cn from 'classnames'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Possible values are:
   * 1: 0.25rem, 4px
   * 4: 1rem, 16px
   * 6: 1.5rem, 24px
   *
   * @default '6'
   */
  gap?: '1' | '4' | '6'
}

function Card({ className, children, gap = '6', ...rest }: Props): JSX.Element {
  return (
    <div
      className={cn([
        className,
        'border border-solid border-gray-200 rounded-md  overflow-hidden',
        {
          'p-1': gap === '1',
          'p-4': gap === '4',
          'p-6': gap === '6'
        }
      ])}
      {...rest}
    >
      {children}
    </div>
  )
}

Card.displayName = 'Card'
export { Card }

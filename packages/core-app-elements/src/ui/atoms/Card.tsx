import cn from 'classnames'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...rest }: Props): JSX.Element {
  return (
    <div
      className={cn([
        className,
        'border border-solid border-gray-200 rounded-md p-6'
      ])}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card

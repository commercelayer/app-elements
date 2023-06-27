import cn from 'classnames'

type Props = Omit<React.HTMLProps<HTMLHRElement>, 'children'>

export function Hr({ className, ...rest }: Props): JSX.Element {
  return (
    <hr className={cn([className, 'border-t border-gray-100'])} {...rest} />
  )
}

Hr.displayName = 'Hr'

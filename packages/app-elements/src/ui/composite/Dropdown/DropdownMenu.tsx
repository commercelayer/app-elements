import cn from 'classnames'

interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  arrow?: 'none'
}

export function DropdownMenu({ children, arrow, ...rest }: Props): JSX.Element {
  const showArrow = arrow === undefined
  const showArrowMenuCss = showArrow && 'mt-[5px]'

  // const arrowHeight = 5
  // const arrowWidth = 12

  const menuLabelSizeCss: Record<number, string[]> = {
    32: [
      'w-0 h-0',
      `absolute top-[-5px] right-[10px]`, // arrowHeight / 2 & (menuLabelSize - arrowWidth) / 2
      `border-b-[5px] border-b-black`, // arrowHeight / 2
      `border-l-[6px] border-l-transparent`, // arrowWidth / 2
      `border-r-[6px] border-r-transparent` // arrowWidth / 2
    ]
  }

  const arrowCss = cn(menuLabelSizeCss[32])

  return (
    <div className='relative'>
      {showArrow && <span className={arrowCss} />}
      <div
        {...rest}
        className={cn([
          'bg-black text-white rounded min-w-[150px] overflow-hidden',
          showArrowMenuCss
        ])}
      >
        {children}
      </div>
    </div>
  )
}

DropdownMenu.displayName = 'DropdownMenu'

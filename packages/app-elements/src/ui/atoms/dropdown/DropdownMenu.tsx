import cn from 'classnames'

interface Props extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  arrow?: 'none'
}

function DropdownMenu({ children, arrow, ...rest }: Props): JSX.Element {
  const showArrow = arrow === undefined
  const showArrowMenuCss = showArrow && 'mt-[5px]'

  return (
    <div className='relative'>
      {showArrow && (
        <span className='w-0 h-0 border-l-[6px] border-l-transparent border-b-[5px] border-b-black border-r-[6px] border-r-transparent absolute top-[-5px] right-[8px]' />
      )}
      <div
        {...rest}
        className={cn([
          'bg-black text-white rounded py-[5px] min-w-[150px] overflow-hidden',
          showArrowMenuCss
        ])}
      >
        {children}
      </div>
    </div>
  )
}

DropdownMenu.displayName = 'DropdownMenu'
export { DropdownMenu }

export function RelationshipCheckboxWrapper({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div {...rest} className='p-3 hover:bg-gray-50 mb-[1px] last:mb-0'>
      {children}
    </div>
  )
}

RelationshipCheckboxWrapper.displayName = 'RelationshipCheckboxWrapper'

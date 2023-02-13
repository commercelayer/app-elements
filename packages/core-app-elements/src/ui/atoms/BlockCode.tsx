interface BlockCodeProps {
  /**
   * Object to render as pre-formatted block
   */
  json?: object
}

function BlockCode({ json, ...rest }: BlockCodeProps): JSX.Element {
  return (
    <div className='whitespace-pre font-mono' {...rest}>
      {json != null && Object.keys(json).length > 0 ? (
        <>{JSON.stringify(json, null, 2)}</>
      ) : (
        <>-</>
      )}
    </div>
  )
}

BlockCode.displayName = 'Badge'
export { BlockCode }

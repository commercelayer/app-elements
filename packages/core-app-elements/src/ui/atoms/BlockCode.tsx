interface BlockCodeProps {
  /**
   * Object to render as pre-formatted block
   */
  json?: object
}

export function BlockCode({ json, ...rest }: BlockCodeProps): JSX.Element {
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

export default BlockCode

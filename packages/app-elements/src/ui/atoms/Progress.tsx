interface ProgressProps {
  /**
   * This attribute describes how much work the task indicated by the `progress` element requires.
   * The `max` attribute, if present, must have a value greater than `0` and be a valid floating point number.
   * @default 1
   */
  max?: number
  /**
   * This attribute specifies how much of the task that has been completed.
   * It must be a valid floating point number between `0` and `max`.
   * If there is no `value` attribute, the progress bar is indeterminate;
   * this indicates that an activity is ongoing with no indication of how long it is expected to take.
   */
  value?: number

  children: React.ReactNode
}

function Progress({ max = 1, value, children }: ProgressProps): JSX.Element {
  return (
    <progress className='progress' max={max} value={value}>
      {children}
    </progress>
  )
}

Progress.displayName = 'Progress'
export { Progress }

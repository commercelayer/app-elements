import { downloadJsonAsFile } from '#helpers/downloadJsonAsFile'
import { Stack } from '#ui/atoms/Stack'
import { Label } from '#ui/forms/Label'
import { ReactNode } from 'react'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'

interface ReportItem {
  label: string
  count: ReactNode
  linkUrl?: string
  linkLabel?: string
  downloadJsonAsFile?: object
  downloadJsonFilename?: string
}

export interface ReportProps {
  items: ReportItem[]
  isLoading?: boolean
  loadingLines?: number
}

function renderItem(item: ReportItem): JSX.Element {
  return (
    <div key={item.label} data-test-id={`report-item-${item.label}`}>
      <Label className='text-sm text-gray-500'>{item.label}</Label>
      <div
        className='font-semibold text-xl font-xl pt-1 pb-4'
        data-test-id={`report-item-${item.label}-count`}
      >
        {item.count}
      </div>
      {item.linkUrl != null ? (
        <a
          title={item.linkLabel}
          target='_blank'
          rel='noopener noreferral noreferrer'
          href={item.linkUrl}
          className='text-sm font-bold text-primary hover:underline'
          data-test-id={`report-item-${item.label}-link`}
        >
          {item.linkLabel ?? 'Download file'}
        </a>
      ) : item.downloadJsonAsFile != null ? (
        <button
          className='text-sm font-bold text-primary hover:underline'
          onClick={() => {
            downloadJsonAsFile({
              json: item.downloadJsonAsFile,
              filename: `${item.downloadJsonFilename ?? 'log'}.json`
            })
          }}
          data-test-id={`report-item-${item.label}-button`}
        >
          {item.linkLabel ?? 'Download JSON'}
        </button>
      ) : null}
    </div>
  )
}

function Report({
  items,
  isLoading = false,
  loadingLines = 2,
  ...rest
}: ReportProps): JSX.Element {
  const skeleton = Array(loadingLines).fill(
    <SkeletonTemplate>
      {renderItem({
        count: 500,
        label: 'Record imported',
        linkUrl: 'https://example.com',
        linkLabel: 'View logs'
      })}
    </SkeletonTemplate>
  )

  return (
    <Stack {...rest}>
      {isLoading ? skeleton : items.map((item) => renderItem(item))}
    </Stack>
  )
}

Report.displayName = 'Report'
export { Report }

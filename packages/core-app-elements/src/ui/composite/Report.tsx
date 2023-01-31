import { downloadJsonAsFile } from '#helpers/downloadJsonAsFile'
import { ReactNode } from 'react'
import { Label } from '#ui/forms/Label'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'

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

export function Report({
  items,
  isLoading,
  loadingLines = 2,
  ...rest
}: ReportProps): JSX.Element {
  if (isLoading === true) {
    return (
      <div {...rest} className='border-t border-b border-gray-100 py-6 mb-14'>
        <Skeleton>
          <div className='flex' data-test-id='report-loading-items'>
            {[...Array(loadingLines).keys()].map((_, idx) => (
              <div
                key={`report-loading-${idx}`}
                className='flex-1 flex flex-col items-start py-2 px-4 border-l border-gray-100 first:border-l-0'
              >
                <SkeletonItem className='h-6 w-20' />
                <SkeletonItem className='h-[30px] w-8 mt-1 mb-4' />
                <SkeletonItem className='h-[21px] w-24' />
              </div>
            ))}
          </div>
        </Skeleton>
      </div>
    )
  }

  return (
    <div {...rest} className='border-t border-b border-gray-100 py-6 mb-14'>
      <div className='flex'>
        {items.map((item, idx) => (
          <div
            data-test-id={`report-item-${idx}`}
            key={`report-item-${idx}`}
            className='flex-1 flex flex-col items-start py-2 px-4 border-l border-gray-100 first:border-l-0'
          >
            <Label className='text-sm text-gray-500'>{item.label}</Label>
            <div
              className='font-semibold text-xl font-xl pt-1 pb-4'
              data-test-id={`report-item-${idx}-count`}
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
                data-test-id={`report-item-${idx}-link`}
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
                data-test-id={`report-item-${idx}-button`}
              >
                {item.linkLabel ?? 'Download JSON'}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Report

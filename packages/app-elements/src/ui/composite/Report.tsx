import type { JSX, Key, ReactNode } from "react"
import { downloadJsonAsFile } from "#helpers/downloadJsonAsFile"
import { t } from "#providers/I18NProvider"
import { SkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Stack } from "#ui/atoms/Stack"
import { Label } from "#ui/forms/Label"

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

function renderItem(item: ReportItem, key: Key): JSX.Element {
  return (
    <div key={key} data-testid={`report-item-${item.label}`}>
      <Label className="text-sm text-gray-500">{item.label}</Label>
      <div
        className="font-semibold text-xl font-xl pt-1 pb-4"
        data-testid={`report-item-${item.label}-count`}
      >
        {item.count}
      </div>
      {item.linkUrl != null ? (
        <a
          title={item.linkLabel}
          target="_blank"
          rel="noopener noreferrer"
          href={item.linkUrl}
          className="text-sm font-bold text-primary hover:underline"
          data-testid={`report-item-${item.label}-link`}
        >
          {item.linkLabel ?? t("common.download_file")}
        </a>
      ) : item.downloadJsonAsFile != null ? (
        <button
          type="button"
          className="text-sm font-bold text-primary hover:underline"
          onClick={() => {
            downloadJsonAsFile({
              json: item.downloadJsonAsFile,
              filename: `${item.downloadJsonFilename ?? "log"}.json`,
            })
          }}
          data-testid={`report-item-${item.label}-button`}
        >
          {item.linkLabel ?? t("common.download_json")}
        </button>
      ) : null}
    </div>
  )
}

export function Report({
  items,
  isLoading = false,
  loadingLines = 2,
  ...rest
}: ReportProps): JSX.Element {
  const skeleton = Array(loadingLines)
    .fill({
      count: 500,
      label: "Record imported",
      linkUrl: "https://example.com",
      linkLabel: t("common.view_logs"),
    })
    .map(renderItem)

  return (
    <SkeletonTemplate isLoading={isLoading}>
      <Stack {...rest}>{isLoading ? skeleton : items.map(renderItem)}</Stack>
    </SkeletonTemplate>
  )
}

Report.displayName = "Report"

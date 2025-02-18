import isEmpty from 'lodash-es/isEmpty'

/**
 * Trigger the download of requested JSON object as user defined file
 * @param json - optional JSON object that will be the content of downloaded file
 * @param filename - string to define the downloaded file name
 */
export function downloadJsonAsFile({
  json,
  filename
}: {
  json?: object
  filename: string
}): void {
  if (isEmpty(json)) {
    json = {}
  }
  const dataUri =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json))
  const tag = document.createElement('a')
  tag.setAttribute('href', dataUri)
  tag.setAttribute('download', filename)
  document.body.appendChild(tag)
  tag.click()
  tag.remove()
}

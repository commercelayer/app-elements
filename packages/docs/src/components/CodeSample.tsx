import { Source } from '@storybook/addon-docs'
import * as prettierBabel from 'prettier/plugins/babel'
import * as prettierEstree from 'prettier/plugins/estree'
import * as prettier from 'prettier/standalone'
import { useEffect, useState } from 'react'

export function CodeSample({
  fn,
  description
}: {
  fn: () => any
  description?: string
}): JSX.Element {
  const [sanitizedCode, setSanitizedCode] = useState<string>()
  const code = fn.toString()

  const result = fn()

  // This is to avoid name mangling.
  // eslint-disable-next-line no-eval
  eval('')

  useEffect(() => {
    void (async () => {
      let tmpSanitizedCode = code
        .replaceAll('\n', '')
        .replace(/^\(\) => {(.*)}/, '$1')
        .replace(/^\(\)=>{(.*)}$/, '$1')
        .replaceAll('() =>', '')
        .replaceAll('()=>', '')
        .replaceAll('return ', '')
        .replaceAll("eval('')", '')
        .replaceAll('eval("")', '')
        .replaceAll('/* @__PURE__ */ ', '')

      tmpSanitizedCode = await prettier.format(tmpSanitizedCode, {
        singleQuote: true,
        trailingComma: 'none',
        parser: 'babel',
        printWidth: 60,
        plugins: [prettierBabel, prettierEstree]
      })

      tmpSanitizedCode = tmpSanitizedCode.replaceAll(';', ';\n')

      setSanitizedCode(tmpSanitizedCode)
    })()
  }, [code])

  return (
    <>
      {description}
      <Source dark language='js' code={`${sanitizedCode}//=  ${result}`} />
    </>
  )
}

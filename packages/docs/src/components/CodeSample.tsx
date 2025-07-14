import { Source } from '@storybook/addon-docs/blocks'
import { type Plugin } from 'prettier'
import * as prettierEstree from 'prettier/plugins/estree'
import * as prettierTypescript from 'prettier/plugins/typescript'
import * as prettier from 'prettier/standalone'
import { type JSX, useEffect, useState } from 'react'

export interface CodeSampleProps {
  fn: () => any
  code?: string
  description?: string
}

export function CodeSample({
  fn,
  code,
  description
}: CodeSampleProps): JSX.Element {
  const [sanitizedCode, setSanitizedCode] = useState<string>()
  const [rawCode, setRawCode] = useState<string | undefined>(code)

  const result = fn()

  // This is to avoid name mangling.
  // eslint-disable-next-line no-eval
  eval('')

  useEffect(
    function UpdateRawCode() {
      if (rawCode === undefined) {
        setRawCode(fn.toString())
      }
    },
    [rawCode]
  )

  useEffect(() => {
    void (async () => {
      if (rawCode !== undefined) {
        let tmpSanitizedCode = rawCode
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
          parser: 'typescript',
          printWidth: 60,
          plugins: [prettierTypescript, prettierEstree as Plugin<any>]
        })

        tmpSanitizedCode = tmpSanitizedCode.replaceAll(';', ';\n')

        setSanitizedCode(tmpSanitizedCode)
      }
    })()
  }, [rawCode])

  return (
    <>
      {description}
      <Source
        dark
        language='jsx'
        code={`${sanitizedCode}//=  ${typeof result === 'object' ? JSON.stringify(result) : result}`}
      />
    </>
  )
}

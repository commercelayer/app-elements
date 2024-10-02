import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import Editor, {
  useMonaco,
  type EditorProps,
  type OnMount,
  type OnValidate
} from '@monaco-editor/react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { type JsonValue, type SetOptional } from 'type-fest'
import { fetchCoreResourcesSuggestions } from './fetchCoreResourcesSuggestions'

export interface CodeEditorProps
  extends InputWrapperBaseProps,
    SetOptional<Pick<HTMLInputElement, 'id' | 'name'>, 'id' | 'name'>,
    Pick<EditorProps, 'defaultValue' | 'value'> {
  /**
   * Height of the editor wrapper
   * @default "200px"
   */
  height?: number | string
  /**
   * Language of the current model
   * @default plaintext
   */
  language?: 'plaintext' | 'json'
  /**
   * JSON Schema to be used when writing JSON
   * @default none
   */
  jsonSchema?: 'none' | 'promotions-rules'
  /**
   * Trigger on every update.
   * @param markers List of markers (errors). `null` when there're no errors.
   * @returns
   */
  onValidate?: (markers: Parameters<OnValidate>[0] | null) => void
  /**
   * Trigger on every update only when there are **no** errors.
   */
  onValid?: (value: string) => void
  onChange?: (value: string) => void
}

const defer = createDeferred(500)

export const CodeEditor = forwardRef<HTMLInputElement, CodeEditorProps>(
  (
    {
      feedback,
      hint,
      inline,
      label,
      defaultValue,
      value,
      language = 'plaintext',
      height = '220px',
      jsonSchema = 'none',
      onValidate,
      onValid,
      onChange,
      ...rest
    },
    ref
  ): JSX.Element => {
    const monaco = useMonaco()
    const disposeCompletionItemProvider = useRef<() => void>()
    const [editor, setEditor] = useState<Parameters<OnMount>[0] | null>(null)

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      setEditor(editor)

      editor.onDidPaste(() => {
        void editor.getAction('editor.action.formatDocument')?.run()
      })

      editor.onDidChangeModelDecorations(() => {
        const model = editor.getModel()
        const markers = monaco.editor.getModelMarkers({
          resource: model?.uri
        })

        const editorValue = editor.getValue()

        defer(() => {
          onValidate?.(markers.length > 0 ? markers : null)
          onChange?.(editorValue)

          if (markers.length === 0) {
            onValid?.(editorValue)
          }
        })
      })
    }

    useEffect(() => {
      void (async function () {
        const uri = editor?.getModel()?.uri.toString()

        if (monaco != null && uri != null && jsonSchema != null) {
          const schemas = (
            monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas ?? []
          ).filter((schema) => {
            // Remove all previous definitions for that specific `uri`.
            const fileMatches = schema.fileMatch?.includes(uri) ?? false
            return !fileMatches
          })

          disposeCompletionItemProvider.current?.()

          switch (jsonSchema) {
            case 'none': {
              break
            }

            case 'promotions-rules': {
              schemas.push({
                schema: await fetch(
                  // 'http://localhost:6006/rules.json'
                  'https://core.commercelayer.io/api/public/schemas/rules'
                )
                  .then<JsonValue>(async (res) => await res.json())
                  .then((json) => {
                    return clearExamples(json)
                  }),
                uri: `file:///json-schema--${jsonSchema}.json`,
                fileMatch: [uri]
              })

              disposeCompletionItemProvider.current =
                monaco.languages.registerCompletionItemProvider('json', {
                  triggerCharacters: ['"', ':', '.'],
                  provideCompletionItems: async function (model, position) {
                    if (model.uri.toString() !== uri.toString()) {
                      return {
                        suggestions: []
                      }
                    }

                    const wordInfo = model.getWordUntilPosition(position)

                    // Get the entire line up to the cursor
                    const lineContent = model
                      .getLineContent(position.lineNumber)
                      .substring(0, position.column - 1)

                    // Check if we're editing the value of the "field" key
                    const fieldRegex = /"(field|selector)"\s*:\s*"[^"]*$/

                    if (fieldRegex.test(lineContent)) {
                      const currentValue = wordInfo.word

                      if (currentValue != null) {
                        const suggestions = await fetchCoreResourcesSuggestions(
                          ['order'],
                          currentValue
                        )

                        return {
                          incomplete: false,
                          suggestions: suggestions.map((suggestion) => ({
                            kind:
                              suggestion.type === 'relationship'
                                ? monaco.languages.CompletionItemKind.Module
                                : monaco.languages.CompletionItemKind.Value,
                            label: suggestion.value,
                            insertText: suggestion.value,
                            // documentation: `Field: ${suggestion}`,
                            range: {
                              startLineNumber: position.lineNumber,
                              startColumn: wordInfo.startColumn,
                              endLineNumber: position.lineNumber,
                              endColumn: wordInfo.endColumn
                            }
                          }))
                        }
                      }
                    }

                    return {
                      suggestions: []
                    }
                  }
                }).dispose = () => {}

              break
            }
          }

          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            enableSchemaRequest: true,
            schemaRequest: 'ignore',
            schemaValidation: 'error',
            validate: true,
            schemas
          })
        }
      })()

      return () => {
        disposeCompletionItemProvider.current?.()
      }
    }, [monaco, editor, jsonSchema])

    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
        inline={inline}
      >
        <Editor
          defaultPath={rest.id ?? rest.name}
          className='[&>.monaco-editor]:rounded [&>.monaco-editor>.overflow-guard]:rounded'
          theme='vs-dark'
          language={language}
          height={height}
          defaultValue={defaultValue}
          value={value}
          onMount={handleEditorDidMount}
          options={{
            quickSuggestions: true,
            readOnly: false,
            automaticLayout: true,
            insertSpaces: true,
            tabSize: 2,
            lineNumbers: 'on',
            padding: { top: 18, bottom: 18 },
            scrollBeyondLastLine: false,
            pasteAs: { enabled: true },
            minimap: {
              enabled: false
            }
          }}
        />
      </InputWrapper>
    )
  }
)

CodeEditor.displayName = 'CodeEditor'

function createDeferred(delay: number = 100) {
  let timeoutId: NodeJS.Timeout | null = null

  return function defer(callback: () => void): void {
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // Set a new timeout with the provided delay
    timeoutId = setTimeout(() => {
      callback()
      timeoutId = null // Reset timeoutId after execution
    }, delay)
  }
}

/**
 * Remove `examples` attribute when present.
 */
function clearExamples(json: JsonValue): JsonValue {
  if (typeof json !== 'object' || json === null) {
    return json
  }

  return Array.isArray(json)
    ? json.map((item) => clearExamples(item))
    : Object.entries(json).reduce((acc, [key, value]) => {
        if (['examples', 'default'].includes(key)) {
          return acc
        }

        return {
          ...acc,
          [key]: clearExamples(value)
        }
      }, {})
}

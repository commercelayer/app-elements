import { readdir } from 'fs/promises'
import { join, resolve } from 'path'
import * as main from './main'

describe('main.ts', () => {
  it('should define all component exports', async () => {
    const exports = await getExports([
      resolve(__dirname, 'dictionaries'),
      resolve(__dirname, 'helpers'),
      resolve(__dirname, 'hooks'),
      resolve(__dirname, 'providers'),
      resolve(__dirname, 'ui', 'atoms'),
      resolve(__dirname, 'ui', 'composite'),
      resolve(__dirname, 'ui', 'forms'),
      resolve(__dirname, 'ui', 'hook-form'),
      resolve(__dirname, 'ui', 'lists'),
      resolve(__dirname, 'ui', 'resources')
    ])

    expect(Object.keys(main).sort()).toEqual(exports.sort())
  })
})

async function getExports(path: string | string[]): Promise<string[]> {
  if (Array.isArray(path)) {
    return (await Promise.all(path.map(getExports))).flat()
  }

  const files = (
    await readdir(path, {
      encoding: 'utf8',
      withFileTypes: true
    })
  ).filter(
    (file) =>
      (file.isDirectory() && file.name !== '__snapshots__') ||
      (file.isFile() && /^((?!.test|.mock|.utils).)*.tsx?$/.test(file.name))
  )

  return (
    await Promise.all(
      files.map(async (file) =>
        Object.keys(
          await import(
            join(
              path,
              file.isDirectory() ? join(file.name, 'index') : file.name
            )
          )
        )
      )
    )
  ).flat()
}
